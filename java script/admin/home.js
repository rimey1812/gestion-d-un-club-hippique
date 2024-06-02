import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
                                backgroundColor = '#ce2c17';
                                hoverColor = '#961909';
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
        let horsesHtml = '';

        horsesCollection.forEach((doc) => {
            if (doc.id === "food informations") return; // Skip document with ID "food_informations"
            const horse = doc.data();
            horsesHtml += createHorseItem(horse);
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

// Load all horses initially
loadAllHorses();
