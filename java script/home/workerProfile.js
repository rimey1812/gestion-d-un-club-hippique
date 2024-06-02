const userLoggedIn = localStorage.getItem('isLoggedIn');

if (!userLoggedIn) {
    document.addEventListener('click', function(event) {
        window.location.href = '../login & signup/login.html';
    });
}

else{
    
}

const userData = JSON.parse(localStorage.getItem('userData'));
    const photoProfileUrl = userData.photoProfileUrl;
    const profileImg = document.querySelector('.profile-img');
    profileImg.style.backgroundImage = `url(${photoProfileUrl})`;



let lougout = document.querySelector(".logout");
lougout.addEventListener('click',function(){
    localStorage.clear();
    setTimeout(()=>{
        window.location = "../login & signup/login.html"
    } , 1500)
})


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";



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



const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

// Function to fetch document data using email
async function fetchData() {
    if (email) {
        const docRef = doc(firestore, "workers", email); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {   
            displayData(docSnap.data(), email);
        } else {
            console.log("No such document!");
        }
    } else {
        console.log("No email provided!");
    }
}

function displayData(data, email) {
    const titleName = document.querySelector('.profile-info-title');
    const name = document.querySelector('.name');
    const emailField = document.querySelector('.email'); 
    const phoneNumber = document.querySelector('.phoneNumber');
    const type = document.querySelector('.type');
    const salary = document.querySelector('.salary');
    const isActive = document.querySelector('.is-active');
    const startDate = document.querySelector('.start-date');
    const paymentDate = document.querySelector('.payement-date');
    const photoProfileUrl = document.querySelector('.profile-img-desc img');

    titleName.innerHTML = `<b>${data.name}'s Profile</b>`;
    name.innerHTML = `<b>Name:</b> ${data.name}`;
    emailField.innerHTML = `<b>Email:</b> ${email}`;
    phoneNumber.innerHTML = `<b>Phone Number:</b> ${data.phoneNumber}`;
    type.innerHTML = `<b>Type:</b> ${data.type}`;
    salary.innerHTML = `<b>Salary:</b> ${data.salary}`;
    isActive.innerHTML = `<b>Is Active:</b> ${data.isActive ? 'Yes' : 'No'}`;
    startDate.innerHTML = `<b>Start Date:</b> ${data.startDate.toDate().toDateString()}`;
    paymentDate.innerHTML = `<b>Payment Date:</b> ${data.paymentDate.toDate().toDateString()}`;
    photoProfileUrl.src = data.photoProfileUrl || 'default-image-path.jpg';  // Replace with your default image path

    const disableAccount = document.querySelector('.Disable-account');
    if (data.isActive) {
        disableAccount.textContent = "Delete Account";
    } else {
        disableAccount.textContent = "Enable Account";
    }
}

fetchData();  // Call the function to fetch data

const disableAccount = document.querySelector('.Disable-account');
const err = document.querySelector('.err');

disableAccount.addEventListener('click', async function () {
    try {
        const docRef = doc(firestore, "workers", email);
        await deleteDoc(docRef);

        err.textContent = 'Account deleted successfully!';
        err.style.color = 'green';

        setTimeout(() => {
            window.location.href = 'workers.html';
        }, 1500);
    } catch (error) {
        console.error("Error deleting document: ", error);
        err.textContent = 'Error deleting account!';
        err.style.color = 'red';
    }
});
