import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";


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
  

  const addWorkerForm = document.querySelector('.add-worker-form');

  addWorkerForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const workerName = document.querySelector('.worker-name').value;
      const workerEmail = document.querySelector('.worker-email').value;
      const workerPhone = document.querySelector('.worker-phone').value;
      const workerType = document.querySelector('.user-type').value;
      const addWorkerErr = document.querySelector('.add-worker-form .error-message');
  
      const salaryMap = {
          horse_keeper: 35000,
          trainer: 60000,
          secretary: 35000,
          guard: 20000,
          veterinarian: 45000
      };
  
      const workerSalary = salaryMap[workerType];
  
      if (!workerSalary) {
          addWorkerErr.textContent = 'Invalid worker type selected.';
          addWorkerErr.style.color = 'red';
          return;
      }
  
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      const nextMonth = month === 11 ? 0 : month + 1; // Adjust for zero-based index
  
      // Construct dates directly
      const currentDateVariable = new Date(year, month, day);
      const nextDateVariable = new Date(year, nextMonth, day);
  
      const workerDocRef = doc(firestore, 'workers', workerEmail);
  
      getDoc(workerDocRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
              addWorkerErr.textContent = 'A worker with this email already exists.';
              addWorkerErr.style.color = 'red';
          } else {
              setDoc(workerDocRef, {
                  name: workerName,
                  email: workerEmail,
                  phoneNumber: workerPhone,
                  type: workerType,
                  salary: workerSalary,
                  startDate: currentDateVariable,
                  paymentDate: nextDateVariable,
                  photoProfileUrl: 'https://i.pinimg.com/564x/c3/50/d3/c350d3ccbc726ce424759d5cf99abb84.jpg',
                  isActive: true,
              })
              .then(() => {
                  console.log('Worker added to Firestore successfully');
                  addWorkerErr.textContent = 'Worker added successfully';
                  addWorkerErr.style.color = 'green';
                  addWorkerForm.reset();
              })
              .catch((error) => {
                  console.error('Error adding worker to Firestore:', error);
                  addWorkerErr.textContent = `Error adding worker: ${error.message}`;
                  addWorkerErr.style.color = 'red';
              });
          }
      })
      .catch((error) => {
          console.error('Error checking worker existence in Firestore:', error);
          addWorkerErr.textContent = `Error checking worker existence: ${error.message}`;
          addWorkerErr.style.color = 'red';
      });
  });



// HTML Elements
const wrapperDiv = document.querySelector('.wrapper');
const totalSalaryTodayElement = document.querySelector('.total-salary-today');

// Initialize total salary
let totalSalaryToday = 0;

// Function to fetch and display workers
function fetchAndDisplayWorkers() {
    const workersCollection = collection(firestore, 'workers');
    const currentDate = new Date();

    getDocs(workersCollection).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const worker = doc.data();
            const paymentDate = worker.paymentDate.toDate(); // Assuming Firestore stores dates as Timestamp

            if (currentDate.toDateString() === paymentDate.toDateString()) {
                // Add to total salary
                totalSalaryToday += worker.salary;

                // Create worker HTML element
                const userInfoDiv = document.createElement('div');
                userInfoDiv.className = 'user-info';
                userInfoDiv.style.cssText = 'display: inline-block; border: 1px solid #666666; margin: 8px';

                userInfoDiv.innerHTML = `
                    <div class="user-info-img" style="padding: 5px;">
                        <img src= ${worker.photoProfileUrl} alt="User Photo" id="user-photo">
                    </div>
                    <div class="user-info-infos" style="padding: 8px;">
                        <p id="user-name">${worker.name}</p>
                        <button class="start-btn pay-now-btn" style="display: inline-block; margin-right: 5px;">Pay Now</button>
                        <button class="start-btn remove-btn" style="background-color: red; display: inline-block; float: right;">Remove</button>
                    </div>
                `;

                // Append to wrapper after the total-salary-today paragraph
                totalSalaryTodayElement.insertAdjacentElement('afterend', userInfoDiv);

                // Pay Now button functionality
                const payNowButton = userInfoDiv.querySelector('.pay-now-btn');
                payNowButton.addEventListener('click', () => {
                    updateWorkerPaymentDates(doc.id, worker.salary);
                });

                // Remove button functionality
                const removeButton = userInfoDiv.querySelector('.remove-btn');
                removeButton.addEventListener('click', () => {
                    removeWorker(doc.id, worker.salary);
                });
            }
        });

        // Update total salary today
        totalSalaryTodayElement.innerHTML = `<b>Payment value today: </b> ${totalSalaryToday.toFixed(2)} DZD`;
    }).catch((error) => {
        console.error('Error fetching workers:', error);
    });
}

// Function to update worker payment dates
function updateWorkerPaymentDates(workerEmail, salary) {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const nextMonth = month === 11 ? 0 : month + 1;

    const newStartDate = new Date(year, month, day);
    const newPaymentDate = new Date(year, nextMonth, day);

    const workerDocRef = doc(firestore, 'workers', workerEmail);
    updateDoc(workerDocRef, {
        startDate: newStartDate,
        paymentDate: newPaymentDate
    }).then(() => {
        // Update total salary today
        totalSalaryToday -= salary;
        totalSalaryTodayElement.innerHTML = `<b>Payment value today: </b> ${totalSalaryToday.toFixed(2)} DZD`;
        
        // Refresh workers display
        wrapperDiv.innerHTML = `
            <h2>Workers salaries</h2>
            <p class="total-salary-today"><b>Payment value today: </b> ${totalSalaryToday.toFixed(2)} DZD</p>
        `;
        location.reload();
        fetchAndDisplayWorkers();
    }).catch((error) => {
        console.error('Error updating worker payment dates:', error);
    });
}

// Function to remove worker
function removeWorker(workerEmail, salary) {
    const workerDocRef = doc(firestore, 'workers', workerEmail);
    deleteDoc(workerDocRef).then(() => {
        // Update total salary today
        totalSalaryToday -= salary;
        totalSalaryTodayElement.innerHTML = `<b>Payment value today: </b> ${totalSalaryToday.toFixed(2)} DZD`;
        
        // Refresh the page
        location.reload();
    }).catch((error) => {
        console.error('Error removing worker:', error);
    });
}

// Fetch and display workers initially
fetchAndDisplayWorkers();













/* Search For user section */
document.querySelector('.search-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputValue = document.getElementById('search-input').value;
    const userInfoDiv = document.querySelector('.user-info');
    const userPhoto = document.getElementById('user-photo');
    const userNameDisplay = document.getElementById('user-name');
    const userProfileLink = document.querySelector('.visit');

    try {
        const userDocRef = doc(firestore, 'workers', inputValue);
        const querySnapshot = await getDoc(userDocRef);
        if (querySnapshot.exists()) {
            displayUserInfo(querySnapshot, inputValue);
        } else {
            alert("No worker found with the given email.");
        }
    } catch (error) {
        console.error("Error in worker search:", error);
        alert("Error occurred while searching for worker.");
    }

    function displayUserInfo(userDoc, email) {
        const userData = userDoc.data();
        userPhoto.src = userData.photoProfileUrl || 'default-image-path.jpg'; // Replace with your default image path
        userNameDisplay.textContent = userData.name;
        userInfoDiv.style.display = 'block';
        userProfileLink.href = `workerProfile.html?email=${email}`;
    }
});



  