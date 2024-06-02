// Your existing code
const userData = JSON.parse(localStorage.getItem('userData'));
const photoProfileUrl = userData.photoProfileUrl;

const profileImg = document.querySelector('.profile-img');
profileImg.style.backgroundImage = `url(${photoProfileUrl})`;

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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
                displayUserInfo(querySnapshot, inputValue);
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

const uid = userData.uid;
const userDocRef = doc(firestore, 'users', uid);
const querySnapshot = await getDoc(userDocRef);
if (querySnapshot.exists()) {
    const userDataFromFireBase = querySnapshot.data();
    const currentDate = new Date();
    const endDate = new Date(userDataFromFireBase.endDate.seconds * 1000);

    if (endDate < currentDate) {
        userDataFromFireBase.isActive = false;
        await setDoc(userDocRef, userDataFromFireBase);
        localStorage.setItem('userData', JSON.stringify(userDataFromFireBase));
        alert("Your account has been deactivated, please recharge your account to keep using our services.");
        localStorage.clear();
        setTimeout(() => {
            window.location = "../login & signup/login.html"
        }, 1500);
    }
} else {
    alert("No user found with the given UID.");
}











async function loadHorses() {
    const horsesContainer = document.querySelector('.your-horses .wrapper');

    function createHorseItem(horse) {
        const staticReservationTimes = [
            "08:00 - 10:00",
            "10:00 - 12:00",
            "13:00 - 15:00",
            "15:00 - 17:00",
            "17:00 - 19:00"
        ];

        return `
            <div class="horses-item">
                <div class="horses-item-item">
                    <div class="horses-item-img">
                        <img src="${horse.photoProfileUrl}" alt="Horse">
                    </div>
                </div>
                <div class="horses-item-infos">
                    <p><b>Horse Name:</b> ${horse.name}</p>
                    <p><b>Horse Box Number:</b> ${horse.boxNumber}</p>
                    <p><b>Age:</b> ${horse.age} years</p>
                    <span>Reservation Times:</span>
                    <ul>
                        ${staticReservationTimes.map(time => {
                            let backgroundColor = '#e7e7f1';
                            let hoverColor = '#b8b8c5';

                            if (horse.reservationTimes && horse.reservationTimes[time]) {
                                if (horse.reservationTimes[time] === uid) {
                                    backgroundColor = '#4eee0f';
                                    hoverColor = '#37b306';
                                } else {
                                    backgroundColor = '#ce2c17';
                                    hoverColor = '#961909';
                                }
                            }

                            return `<li style="background-color: ${backgroundColor};" 
                                        data-uid="${horse.reservationTimes[time] || ''}" 
                                        onmouseover="this.style.backgroundColor='${hoverColor}'" 
                                        onmouseout="this.style.backgroundColor='${backgroundColor}'">
                                        ${time}
                                    </li>`;
                        }).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    try {
        const horsesCollection = await getDocs(collection(firestore, 'horses'));
        let horsesHtml = '<h2> Your Horses </h2>';

        horsesCollection.forEach((doc) => {
            if (doc.id === "food informations") return; // Skip document with ID "food_informations"
            
            const horse = doc.data();
            if (horse.ownerUid === uid) {
                horsesHtml += createHorseItem(horse);
            }
        });

        horsesContainer.innerHTML = horsesHtml;

        horsesContainer.querySelectorAll('li').forEach(li => {
            if (li.dataset.uid) {
                li.addEventListener('click', () => {
                    navigator.clipboard.writeText(li.dataset.uid)
                        .then(() => {
                            console.log('UID copied to clipboard:', li.dataset.uid);
                            const notification = document.createElement('div');
                            notification.textContent = 'UID copied to clipboard';
                            notification.classList.add('notification');
                            document.body.appendChild(notification);
                            setTimeout(() => {
                                document.body.removeChild(notification);
                            }, 3000);
                        })
                        .catch(err => {
                            console.error('Failed to copy UID to clipboard:', err);
                        });
                });
            }
        });

    } catch (error) {
        console.error('Error retrieving horses:', error);
    }
}

async function loadAllHorses() {
    const allHorsesContainer = document.querySelector('.all-horses .wrapper');

    function createHorseItem(horse) {
        const staticReservationTimes = [
            "08:00 - 10:00",
            "10:00 - 12:00",
            "13:00 - 15:00",
            "15:00 - 17:00",
            "17:00 - 19:00"
        ];

        return `
            <div class="horses-item">
                <div class="horses-item-item">
                    <div class="horses-item-img">
                        <img src="${horse.photoProfileUrl}" alt="Horse">
                    </div>
                </div>
                <div class="horses-item-infos">
                    <p><b>Horse Name:</b> ${horse.name}</p>
                    <p><b>Horse Box Number:</b> ${horse.boxNumber}</p>
                    <p><b>Age:</b> ${horse.age} years</p>
                    <span>Reservation Times:</span>
                    <ul>
                        ${staticReservationTimes.map(time => {
                            let backgroundColor = '#e7e7f1';
                            let hoverColor = '#b8b8c5';

                            if (horse.reservationTimes && horse.reservationTimes[time]) {
                                if (horse.reservationTimes[time] === uid) {
                                    backgroundColor = '#4eee0f';
                                    hoverColor = '#37b306';
                                } else {
                                    backgroundColor = '#ce2c17';
                                    hoverColor = '#961909';
                                }
                            }

                            return `<li style="background-color: ${backgroundColor};" 
                                        data-uid="${horse.reservationTimes[time] || ''}" 
                                        onmouseover="this.style.backgroundColor='${hoverColor}'" 
                                        onmouseout="this.style.backgroundColor='${backgroundColor}'">
                                        ${time}
                                    </li>`;
                        }).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    try {
        const horsesCollection = await getDocs(collection(firestore, 'horses'));
        let horsesHtml = '<h2> All Horses </h2>';

        horsesCollection.forEach((doc) => {
            if (doc.id === "food informations") return; // Skip document with ID "food_informations"
            
            const horse = doc.data();
            if (horse.ownerUid !== uid) {
                horsesHtml += createHorseItem(horse);
            }
        });

        allHorsesContainer.innerHTML = horsesHtml;

        allHorsesContainer.querySelectorAll('li').forEach(li => {
            if (li.dataset.uid) {
                li.addEventListener('click', () => {
                    navigator.clipboard.writeText(li.dataset.uid)
                        .then(() => {
                            console.log('UID copied to clipboard:', li.dataset.uid);
                            const notification = document.createElement('div');
                            notification.textContent = 'UID copied to clipboard';
                            notification.classList.add('notification');
                            document.body.appendChild(notification);
                            setTimeout(() => {
                                document.body.removeChild(notification);
                            }, 3000);
                        })
                        .catch(err => {
                            console.error('Failed to copy UID to clipboard:', err);
                        });
                });
            }
        });

    } catch (error) {
        console.error('Error retrieving horses:', error);
    }
}

async function checkAndUpdateReservations() {
    try {
        const horsesCollection = await getDocs(collection(firestore, 'horses'));
        const currentTime = new Date();
        const currentHour = String(currentTime.getHours()).padStart(2, '0');
        const currentMinute = String(currentTime.getMinutes()).padStart(2, '0');
        const currentHourMinute = `${currentHour}:${currentMinute}`;

        horsesCollection.forEach(async (doc) => {
            const horse = doc.data();
            const horseDocRef = doc.ref;
            const updatedReservationTimes = { ...horse.reservationTimes };

            Object.keys(updatedReservationTimes).forEach(time => {
                const endTime = time.split(' - ')[1];
                if (currentHourMinute === endTime) {
                    updatedReservationTimes[time] = ""; // Clear the reservation if current time matches end time
                }
            });

            await setDoc(horseDocRef, { reservationTimes: updatedReservationTimes }, { merge: true });
        });

    } catch (error) {
        console.error('Error checking and updating reservations:', error);
    }
}

// Schedule the checkAndUpdateReservations function to run every minute
setInterval(checkAndUpdateReservations, 60000);

// Load horses initially
loadHorses();
loadAllHorses();