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
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";



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
const uid = urlParams.get('uid');

// Function to fetch document data using UID
async function fetchData() {
    if (uid) {
        const docRef = doc(firestore, "users", uid); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {   
            displayData(docSnap.data(), uid);
        } else {
            console.log("No such document!");

        }
    } else {
        console.log("No UID provided!");

    }
}



function displayData(data, uid) {
    

    const titleName = document.querySelector('.profile-info-title');
    const userId = document.querySelector('.uid');
    const name = document.querySelector('.name');
    const email = document.querySelector('.email'); 
    const phoneNumber = document.querySelector('.phoneNumber');
    const age = document.querySelector('.age');
    const haveHorses = document.querySelector('.have-horses');
    const isActive = document.querySelector('.is-active');
    const startSubscription = document.querySelector('.start-subscription');
    const endSubscription = document.querySelector('.end-subscription');
    const photoProfileUrl = document.querySelector('.profile-img-desc img');


    titleName.innerHTML = `<b>${data.name}'s Profile</b>`;
    userId.innerHTML =  `<b>User ID:</b> ${uid}`;
    name.innerHTML = `<b>User Name:</b> ${data.name}`;
    email.innerHTML = `<b>User Email:</b> ${data.email}`;
    phoneNumber.innerHTML = `<b>User Phone Number:</b> ${data.phoneNumber}`;
    age.innerHTML = `<b>User Age:</b> ${data.age}`;
    haveHorses.innerHTML = `<b>Have Horses:</b> ${data.haveHorses? 'Yes' : 'No'}`;
    isActive.innerHTML = `<b>Is Active:</b> ${data.isActive ? 'Yes' : 'No'}`;

    // Check if the user is admin
    if (data.isAdmin) {
        startSubscription.innerHTML = `<b>Start Subscription:</b> Not available`;
        endSubscription.innerHTML = `<b>End Subscription:</b> Not available`;
    } else {
        startSubscription.innerHTML = `<b>Start Subscription:</b> ${data.startDate.toDate().toDateString()}`;
        endSubscription.innerHTML = `<b>End Subscription:</b> ${data.endDate.toDate().toDateString()}`;
    }
    photoProfileUrl.src = data.photoProfileUrl;  

    const disableAccount = document.querySelector('.Disable-account');
    const enableAccount = document.querySelector('.Enable-account');

    if (data.isActive) {
        disableAccount.style.display = "block";
        enableAccount.style.display = "none";
    } else {
        disableAccount.style.display = "none";
        enableAccount.style.display = "block";
    }
}




String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

fetchData();  // Call the function to fetch data



const disableAccount = document.querySelector('.Disable-account');
const enableAccount = document.querySelector('.Enable-account');
const err = document.querySelector('.err');

disableAccount.addEventListener('click', async function () {
    const docRef = doc(firestore, "users", uid);
    await updateDoc(docRef, {
        isActive: false
    });
    
    // Disable the disable button and enable the enable button
    disableAccount.style.display = "none";
    enableAccount.style.display = "block";

    err.textContent = 'Account disabled successfully!';
    err.style.color = 'green';
    
    setTimeout(() => {
        window.location.reload();
    }, 1500);
});

enableAccount.addEventListener('click', async function () {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const year = currentDate.getFullYear();
    const nextMonth = month === 12 ? 1 : month + 1; // Check if current month is December
    // Construct dates directly
    const currentDateVariable = new Date(year, month - 1, day); // Subtract 1 from month to adjust for zero-based indexing
    const nextDateVariable = new Date(year, nextMonth - 1, day); // Subtract 1 from next month
    const docRef = doc(firestore, "users", uid);
    await updateDoc(docRef, {
        isActive: true,
        startDate: currentDateVariable,
        endDate: nextDateVariable,

    });

    // Enable the disable button and disable the enable button
    disableAccount.style.display = "none";
    enableAccount.style.display = "block";

    err.textContent = 'Account enabled successfully!';
    err.style.color = 'green';

    setTimeout(() => {
        window.location.reload();
    }, 1500);
});
