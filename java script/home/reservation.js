import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc,collection,updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";



// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCTbx45h8JxTxiWjffageMGdhuj47vQEcQ",
    authDomain: "equitrain-75d79.firebaseapp.com",
    projectId: "equitrain-75d79",
    storageBucket: "equitrain-75d79.appspot.com",
    messagingSenderId: "888486571768",
    appId: "1:888486571768:web:bb582c7420c4cdf2eb150d",
    measurementId: "G-22M8Z4XHT9"
};


const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);


// Get user data from localStorage
const userData = JSON.parse(localStorage.getItem('userData'));

// Function to reserve the horse
async function reserveHorse(horseDocRef, selectedTime, userUid) {
    try {
        const horseDocSnapshot = await getDoc(horseDocRef);
        const horseData = horseDocSnapshot.data();
        
        // Create a copy of existing reservation times
        const updatedReservationTimes = { ...horseData.reservationTimes };

        // Update the reservation time with the new user UID
        updatedReservationTimes[selectedTime] = userUid;

        // Update the document with the new reservation times
        await setDoc(horseDocRef, { reservationTimes: updatedReservationTimes }, { merge: true });
    } catch (error) {
        console.error('Error reserving horse:', error);
        throw error; // Rethrow the error for the calling function to handle
    }
}

// Function to handle form submission
document.querySelector('.signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get selected horse box number and reservation time
    const selectedBox = document.getElementById('horse-box').value;
    const selectedTime = document.getElementById('reservation-time').value.replace('-', ' - '); // Adjust format

    // Construct document ID based on selected horse box number
    const horseDocId = `horse${selectedBox}`;

    // Get reference to the horse document
    const horseDocRef = doc(collection(firestore, 'horses'), horseDocId);

    try {
        // Get horse data
        const horseDocSnapshot = await getDoc(horseDocRef);
        const horseData = horseDocSnapshot.data();

        // Check if user is the owner of the horse
        if (horseData.ownerUid === userData.uid) {
            // If owner, directly reserve the horse
            await reserveHorse(horseDocRef, selectedTime, userData.uid);
            displayMessage('Reservation successful!', 'green');
        } else {
            // If not owner, check if the selected time is available
            if (horseData.reservationTimes[selectedTime]) {
                displayMessage('This time slot is already reserved', 'red');
            } else {
                // Reserve the horse for the user
                await reserveHorse(horseDocRef, selectedTime, userData.uid);
                displayMessage('Reservation successful!', 'green');
            }
        }
    } catch (error) {
        console.error('Error reserving horse:', error);
        displayMessage('An error occurred, please try again later', 'red');
    }
});

// Function to display message
function displayMessage(message, color) {
    const errDiv = document.querySelector('.err');
    errDiv.innerHTML = `<p style="color: ${color};">${message}</p>`;
}

