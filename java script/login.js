const userLoggedIn = localStorage.getItem('isLoggedIn');


if (!userLoggedIn) {
}

else {
    window.location.href = '../home/home.html';
}


// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc,updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Select the form, email, password, and repeat password input fields
const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorDiv = document.querySelector('.err');

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
const auth = getAuth();
const firestore = getFirestore(app);



// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        // Retrieve user information from Firestore using the UID as the document ID
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
    
        // Check if user exists and isActive is true
        if (userDoc.exists() && userDoc.data().isActive) {
            const userData = userDoc.data();
            const currentDate = new Date();
            const endDate = new Date(userData.endDate.seconds * 1000); // Convert Firestore Timestamp to JavaScript Date
    
            // Check if current date is before the endDate
            if ( userData.isAdmin === true || currentDate < endDate ) {
                // Store user data in localStorage
                localStorage.setItem('userData', JSON.stringify({ ...userData, uid: user.uid }));
                localStorage.setItem('isLoggedIn', true);
                
                // Display success message
                errorDiv.textContent = 'Logged in successfully!';
                errorDiv.style.color = 'green';
    
                // Redirect to home page after a delay
                setTimeout(() => {
                    window.location.href = '../home/home.html';
                }, 1200);
            } else {
                // If current date is past the endDate, display error message and sign out user
                errorDiv.textContent = "Your account has expired. Please contact support.";
                errorDiv.style.color = 'red';
                await updateDoc(doc(firestore, "users", user.uid), {
                    isActive: false
                });
                auth.signOut(); // Sign out the user to prevent further access
                
            }
        } else {
            // If user does not exist or is not active, display appropriate error message
            errorDiv.textContent = "User account does not exist or is inactive.";
            errorDiv.style.color = 'red';
            auth.signOut(); // Sign out the user to prevent further access
        }
    }catch (error) {
        // Display error message
        errorDiv.textContent = error.message;
        errorDiv.style.color = 'red';
    }
});
