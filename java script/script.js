const form = document.getElementById("myForm");
const Name = document.getElementById("name");
const errorMsg = document.getElementById("errorMsg");
const emailInput = document.querySelector('input[type="email"]');
const messageTextarea = document.querySelector('textarea');
let checkValidity = false;

// First event listener for form submission
form.addEventListener("submit", function(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Validate form fields
    if (!form.checkValidity()) {
        errorMsg.innerHTML = "Please fill out all required fields!";
        errorMsg.style.color = "red";
        checkValidity = false;
    } else if (!emailInput.validity.valid) {
        errorMsg.innerHTML = "Email is not valid!";
        errorMsg.style.color = "red";
        checkValidity = false;
    } else if (messageTextarea.value.length < 50) {
        errorMsg.innerHTML = "Message must be at least 50 characters long!";
        errorMsg.style.color = "red";
        checkValidity = false;
    } else {
        checkValidity= true
        // No need to prevent default action here
    }
});

// Second event listener for form submission
form.addEventListener('submit', (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Log a message
    console.log("Send successfully!");

    // Retrieve user input values
    const userEmail = emailInput.value;
    const messageBody = messageTextarea.value;

    if(checkValidity){
        // Construct email body
    let Body = `
    <b>Name: </b> ${Name.value}<br>
    <b>Email: </b> ${userEmail}<br>
    <b>Message: </b> ${messageBody}<br>
`;

    // Send email
    Email.send({
        SecureToken : "1a181f05-2499-46b0-bed5-b53e03af15d5",
        To : 'rimeyy.18@gmail.com',
        From : 'rimeyy.18@gmail.com',
        Subject : "Message from an external party ",
        Body : Body
    }).then(
        () => { // Success callback
            errorMsg.innerHTML = "Send successfully!";
            errorMsg.style.color = "green";
        },
        (error) => { // Error callback
            console.error('Error:', error);
            errorMsg.innerHTML = "Failed to send email.";
            errorMsg.style.color = "red";
        }
    );
    }
});