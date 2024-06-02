const userLoggedIn = localStorage.getItem('isLoggedIn');

if (!userLoggedIn) {
    document.addEventListener('click', function(event) {
        window.location.href = '../login & signup/login.html';
    });
}

else{
    
}



let lougout = document.querySelector(".logout");
lougout.addEventListener('click',function(){
    localStorage.clear();
    setTimeout(()=>{
        window.location = "../login & signup/login.html"
    } , 1500)
})




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";



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


initializeApp(firebaseConfig);
const firestore = getFirestore();












const userData = JSON.parse(localStorage.getItem('userData'));
displayData(userData.uid);

async function displayData(uid) {
    try {
        const docRef = doc(firestore, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            const titleName = document.querySelector('.profile-info-title');
            const userId = document.querySelector('.uid');
            const name = document.querySelector('.name');
            const email = document.querySelector('.email');
            const age = document.querySelector('.age');
            const haveHorses = document.querySelector('.have-horses');
            const isActive = document.querySelector('.is-active');
            const startSubscription = document.querySelector('.start-subscription');
            const endSubscription = document.querySelector('.end-subscription');

            titleName.innerHTML = `<b>${data.name}'s Profile</b>`;
            userId.innerHTML =  `<b>Your ID:</b> ${uid}`;
            name.innerHTML = `<b>Your Name:</b> ${data.name}`;
            email.innerHTML = `<b>Your Email:</b> ${data.email}`;
            age.innerHTML = `<b>Your Age:</b> ${data.age}`;
            haveHorses.innerHTML = `<b>Have Horses:</b> ${data.haveHorses}`;
            isActive.innerHTML = `<b>Is Active:</b> ${data.isActive ? 'Yes' : 'No'}`;

            if (data.isAdmin) {
                startSubscription.innerHTML = "<b>Start Subscription:</b> Not available";
                endSubscription.innerHTML = "<b>End Subscription:</b> Not available";
            } else {
                startSubscription.innerHTML = `<b>Start Subscription:</b> ${data.startDate.toDate().toDateString()}`;
        endSubscription.innerHTML = `<b>End Subscription:</b> ${data.endDate.toDate().toDateString()}`;
            }
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}




// upload image function
const profileImage = document.querySelector('.profile-img-desc img');
let inputFile = document.querySelector('#input-file');
let UserData = JSON.parse(localStorage.getItem('userData'));

// Set the profile image source from userData
profileImage.src = UserData.photoProfileUrl;

// Add onchange event listener to the file input
inputFile.onchange = function() {
    uploadImage();
};

// Function to upload image
async function uploadImage() {
    let file = inputFile.files[0]; // Get the selected file
    let types = ["image/jpeg", "image/png", "image/svg+xml"]; // Supported MIME types

    if (!file) {
        alert("No file selected!");
        return;
    }

    if (types.indexOf(file.type) === -1) {
        alert("Type not supported!");
        inputFile.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert("The file size is too large!");
        return;
    }

    // Call the function to get image as base64 and update URL
    getImageBase64(file);
}

// Function to convert image to base64
async function getImageBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    
    let photoProfileUrl; // Declare photoProfileUrl variable
    
    reader.onload = async function () {
        profileImage.src = reader.result; // Update profileImage source
        photoProfileUrl = reader.result; // Update photoProfileUrl

        // Update photoProfileUrl in userData if userData is defined and accessible
        if (userData) {
            userData.photoProfileUrl = photoProfileUrl;
            // Update photo url in localStorage
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Update photoProfileUrl in Firestore
            try {
                const docRef = doc(firestore, "users", userData.uid);
                await updateDoc(docRef, {
                    photoProfileUrl: photoProfileUrl
                });
                alert("Photo URL updated successfully!");
            } catch (error) {
                console.error("Error updating photo URL in Firestore:", error);
            }
        } else {
            console.error("userData is not defined or accessible.");
        }
    };

    reader.onerror = function () {
        alert("Error reading the file!");
    };
}

