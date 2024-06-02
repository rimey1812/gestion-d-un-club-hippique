import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";


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
const auth = getAuth(app);
const firestore = getFirestore(app);



const addUserForm = document.querySelector('.add-user-form');

addUserForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const userName = document.querySelector('.user-name').value;
    const userEmail = document.querySelector('.user-email').value;
    const userphoneNumber = document.querySelector('.user-phoneNumber').value;
    const userAge = document.querySelector('.user-age').value;
    const haveHorses = document.querySelector('.user-type').value;
    const addUserErr = document.querySelector('.add-user-form .error-message');
    const userPassword = '123123123';


    


    createUserWithEmailAndPassword(auth, userEmail, userPassword)
        .then((userCredential) => {
            const uid = userCredential.user.uid;

            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
            const year = currentDate.getFullYear();
            const nextMonth = month === 12 ? 1 : month + 1; // Check if current month is December

            // Construct dates directly
            const currentDateVariable = new Date(year, month - 1, day); // Subtract 1 from month to adjust for zero-based indexing
            const nextDateVariable = new Date(year, nextMonth - 1, day); // Subtract 1 from next month

            setDoc(doc(firestore, 'users', uid), {
                name: userName,
                email: userEmail,
                phoneNumber: userphoneNumber,
                age: userAge,
                haveHorses: haveHorses,
                isActive: true,
                isAdmin: false,
                startDate: currentDateVariable,
                endDate: nextDateVariable,
                photoProfileUrl: 'https://i.pinimg.com/564x/4e/22/be/4e22beef6d94640c45a1b15f4a158b23.jpg',
                uid: uid
            })
            .then(async () => {
                console.log('User added to Firestore successfully');
                addUserErr.textContent = 'User added successfully';
                addUserErr.style.color = 'green';
                addUserForm.reset();

                try {
                    // Send password reset email
                    await sendPasswordResetEmail(auth, userEmail);
                    console.log('Password reset email sent successfully');
                } catch (error) {
                    console.error('Error sending password reset email:', error);
                }
            })
            .catch((error) => {
                console.error('Error adding user to Firestore:', error);
                addUserErr.textContent = `Error adding user : ${error}`;
                addUserErr.style.color = 'red';
            });
        })
        .catch((error) => {
            console.error('Error creating user in Authentication:', error);
            addUserErr.textContent = `Error adding user : ${error}`;
            addUserErr.style.color = 'red';
        });
});




document.querySelector('.search-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchType = document.getElementById('search-type').value;
    const inputValue = document.getElementById('search-input').value;
    const userInfoDiv = document.querySelector('.user-info');
    const userPhoto = document.getElementById('user-photo');
    const userNameDisplay = document.getElementById('user-name');
    const userProfileLink = document.querySelector('.visit');

    try {
        if (searchType === 'Uid') {
            const userDocRef = doc(firestore, 'users', inputValue);
            const querySnapshot = await getDoc(userDocRef);
            if (querySnapshot.exists()) {
                displayUserInfo(querySnapshot,inputValue );
            } else {
                alert("No user found with the given UID.");
            }
        } else {
            const usersRef = collection(firestore, 'users');
            const queryRef = query(usersRef, where("name", "==", inputValue));
            const querySnapshot = await getDocs(queryRef);
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    
                    displayUserInfo(doc, doc.id);                   
                });
            } else {
                alert("No user found with the given name.");
            }
        }
    } catch (error) {
        console.error("Error in user search:", error);
        alert("Error occurred while searching for user.");
    }

    function displayUserInfo(userDoc, id) {
        const userData = userDoc.data();
        userPhoto.src = userData.photoProfileUrl || 'default-image-path.jpg'; // Replace with your default image path
        userNameDisplay.textContent = userData.name;
        userInfoDiv.style.display = 'block';
        userProfileLink.href = `userProfile.html?uid=${id}`; // Assuming `uid` is the field name for UID in your Firestore data
    }
});




// Populate Users Function
function populateUsers() {
    getDocs(collection(firestore, "users")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userId = doc.id; 
            const userName = userData.name;
            const firstLetter = userName.charAt(0).toLowerCase();
            const alphabetSection = document.getElementById(firstLetter);
            
            
            if (alphabetSection) {
                const userDiv = document.createElement('div');
                userDiv.classList.add('user');
                userDiv.innerHTML = `
                    <div class="user-img">
                        <img src="${userData.photoProfileUrl}" alt="User Photo">
                    </div>
                    <div class="user-info">
                        <p class="user-name">${userName}</p>
                        <a href="userProfile.html?uid=${userId}" class="visit" style="width: 60%; font-size: 13px;" > Visit full profile</a>
                    </div>
                `;
                alphabetSection.appendChild(userDiv);
            } else {
                console.error("Alphabet section not found for letter:", firstLetter);
            }
        });
    }).catch((error) => {
        console.error("Error getting documents: ", error);
    });
}

// Call the populateUsers function to fetch and populate users
populateUsers();




