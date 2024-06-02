// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, getDocs, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Initialize Firebase app
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

document.addEventListener('DOMContentLoaded', function() {
    const addHorseForm = document.querySelector('.add-horse-form');
    const inputFile = document.getElementById('input-file');
    const horseTypeSelect = document.getElementById('horse-type');
    const horseOwnerUidInput = document.getElementById('horse-owner-uid');
    let photoProfileUrl = '';

    // Show or hide the owner UID input field based on the selected value
    horseTypeSelect.addEventListener('change', function() {
        horseOwnerUidInput.style.display = (this.value === 'yes') ? 'block' : 'none';
    });

    // Upload image when file is selected
    inputFile.onchange = function() {
        uploadImage();
    };

    // Function to upload image
    async function uploadImage() {
        let file = inputFile.files[0];

        if (!file) {
            alert("No file selected!");
            return;
        }

        let types = ["image/jpeg", "image/png", "image/jpg"];
        if (types.indexOf(file.type) === -1) {
            alert("Type not supported!");
            inputFile.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("The file size is too large!");
            return;
        }

        // Convert image to base64 and update URL
        await getImageBase64(file);
    }

    // Function to convert image to base64
    async function getImageBase64(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function () {
            photoProfileUrl = reader.result;
        };

        reader.onerror = function () {
            alert("Error reading the file!");
        };
    }

    // Function to calculate horse's daily needs based on its age
    function calculateDailyNeeds(age) {
        let needs = {};

        if (age >= 6 && age <= 24) {
            needs.hay = "6";
            needs.oats = "1.5";
            needs.water = "25";
        } else if (age >= 36 && age <= 180) {
            needs.hay = "9";
            needs.oats = "4.2";
            needs.water = "40";
        } else if (age > 180) {
            needs.hay = "12";
            needs.oats = "7.5";
            needs.water = "60";
        } else {
            return null;
        }

        return needs;
    }

    // Add event listener to the form
    addHorseForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const horseName = document.querySelector('.horse-name').value;
        const horseAge = parseInt(document.querySelector('.horse-age').value);
        const horseBreed = document.querySelector('.horse-breed').value;
        const haveOwner = document.querySelector('.horse-type').value;
        const horseOwnerUid = document.querySelector('.horse-owner-uid').value;
        const addUserErr = document.querySelector('.add-horse-form .error-message');

        // Calculate daily needs based on horse's age
        const horseDailyNeeds = calculateDailyNeeds(horseAge);

        if (!horseDailyNeeds) {
            console.error('Invalid horse age');
            addUserErr.textContent = 'Invalid horse age';
            addUserErr.style.color = 'red';
            return;
        }

        // Get the current number of horses in the collection to assign a new document ID
        const horsesCollection = await getDocs(collection(firestore, 'horses'));
        const horseNumber = horsesCollection.size + 1;
        const horseDocId = `horse${horseNumber}`;

        // Add the horse to Firestore
        setDoc(doc(firestore, 'horses', horseDocId), {
            name: horseName,
            age: horseAge,
            breed: horseBreed,
            hay: horseDailyNeeds.hay,
            oats: horseDailyNeeds.oats,
            water: horseDailyNeeds.water,
            photoProfileUrl: photoProfileUrl,
            haveOwner: haveOwner === 'yes',
            ownerUid: haveOwner === 'yes' ? horseOwnerUid : null,
            boxNumber: horseNumber,
            reservationTimes: {
                "08:00 - 10:00": "",
                "10:00 - 12:00": "",
                "13:00 - 15:00": "",
                "15:00 - 17:00": "",
                "17:00 - 19:00": ""
            }
        })
        .then(async () => {
            console.log('Horse added to Firestore successfully');
            addUserErr.textContent = 'Horse added successfully';
            addUserErr.style.color = 'green';
            addHorseForm.reset();

            if (haveOwner === 'yes') {
                // Update user document with new horse data
                const userDocRef = doc(firestore, 'users', horseOwnerUid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userBoxes = userData.boxes || [];
                    const userCotion = userData.cotion;

                    await updateDoc(userDocRef, {
                        haveHorses: true,
                        boxes: [...userBoxes, horseNumber],
                        cotion: userCotion + 2000
                    });

                    console.log('User data updated with new horse information');
                } else {
                    console.error('User with provided UID does not exist');
                    addUserErr.textContent = 'User with provided UID does not exist';
                    addUserErr.style.color = 'red';
                }
            }
        })
        .catch((error) => {
            console.error('Error adding horse to Firestore:', error);
            addUserErr.textContent = `Error adding horse: ${error}`;
            addUserErr.style.color = 'red';
        });
    });
});




document.addEventListener('DOMContentLoaded', function() {
    const addFoodForm = document.querySelector('.about-horses form');
    const totalHayQty = document.querySelector('.total-hay-qty');
    const totalOatsQty = document.querySelector('.total-oats-qty');
    const totalWaterQty = document.querySelector('.total-water-qty');
    const errorMessage = document.querySelector('.err-message');

    // Add event listener to the form
    addFoodForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const hayQty = parseFloat(document.querySelector('.hay-qty').value) || 0;
        const oatsQty = parseFloat(document.querySelector('.oats-qty').value) || 0;
        const waterQty = parseFloat(document.querySelector('.water-qty').value) || 0;

        // Retrieve existing food information from Firestore
        let existingFoodData = {};
        try {
            const foodDocRef = doc(firestore, 'horses', 'food informations');
            const foodDocSnap = await getDoc(foodDocRef);

            if (foodDocSnap.exists()) {
                existingFoodData = foodDocSnap.data();
            }
        } catch (error) {
            console.error('Error retrieving existing food information:', error);
        }

        // Prepare updated food information
        const updatedFoodData = {};
        if (hayQty !== 0) {
            updatedFoodData.hay = (existingFoodData.hay || 0) + hayQty;
        }
        if (oatsQty !== 0) {
            updatedFoodData.oats = (existingFoodData.oats || 0) + oatsQty;
        }
        if (waterQty !== 0) {
            updatedFoodData.water = (existingFoodData.water || 0) + waterQty;
        }

        // Update or set food information in Firestore
        try {
            await setDoc(doc(firestore, 'horses', 'food informations'), updatedFoodData, { merge: true }); // Use merge option to merge new data with existing data
            errorMessage.textContent = 'Food information updated successfully';
            errorMessage.style.color = 'green';
        } catch (error) {
            console.error('Error updating food information:', error);
            errorMessage.textContent = `Error updating food information: ${error}`;
            errorMessage.style.color = 'red';
        }
    });

    // Retrieve and display food information from Firestore
    async function displayFoodInformation() {
        try {
            const foodDocRef = doc(firestore, 'horses', 'food informations');
            const foodDocSnap = await getDoc(foodDocRef);

            if (foodDocSnap.exists()) {
                const foodData = foodDocSnap.data();
                totalHayQty.textContent = `- Your Total Hay Is: ${foodData.hay || 0} Kg`;
                totalOatsQty.textContent = `- Your Total Oats Is: ${foodData.oats || 0} Kg`;
                totalWaterQty.textContent = `- Your Total Water Is: ${foodData.water || 0} L`;
            } else {
                console.error('Food information document does not exist');
                errorMessage.textContent = 'Food information document does not exist';
                errorMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Error retrieving food information:', error);
            errorMessage.textContent = `Error retrieving food information: ${error}`;
            errorMessage.style.color = 'red';
        }
    }

    // Call the function to display food information when the page loads
    displayFoodInformation();
});

