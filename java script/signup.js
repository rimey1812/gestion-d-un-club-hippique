const userLoggedIn = localStorage.getItem('isLoggedIn');
console.log(userLoggedIn);

if (!userLoggedIn) {
}

else {
    window.location.href = '../home/home.html';
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateAge(age) {
    return age >= 12;
}

function send_info(name, email,phoneNumber, age,textArea,selectValue, errDiv) {
    let Body = `
    <b>Name: </b> ${name}<br>
    <b>Email: </b> ${email}<br>
    <b>Phone Number: </b> ${phoneNumber}<br>
    <b>Age: </b> ${age}<br>
    <b>Have horses: </b> ${selectValue}<br>
    <b>Message: </b> ${textArea}<br>`;
    

    Email.send({
        SecureToken : "1a181f05-2499-46b0-bed5-b53e03af15d5",
        To : 'rimeyy.18@gmail.com',
        From : 'rimeyy.18@gmail.com',
        Subject : "New member to join",
        Body : Body
    }).then(
        () => { // Success callback
            errDiv.innerHTML = "Send successfully!";
            errDiv.style.color = "green";
        },
        (error) => { // Error callback
            console.error('Error:', error);
            errDiv.innerHTML = "Failed to send email.";
            errDiv.style.color = "red";
        }
    );

    console.log("Information sent successfully.");
}

function validateForm() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const age = parseInt(document.getElementById("age").value);
    const selectValue = document.getElementById("user-type").value;
    const textArea = document.getElementById("message").value;
    const errDiv = document.querySelector(".err");

    if (!validateEmail(email)) {
        errDiv.textContent = "Please enter a valid email.";
        errDiv.style.color = "red";
        return;
    }

    if (!validateAge(age)) {
        errDiv.textContent = "You must be at least 12 years old.";
        errDiv.style.color = "red";
        return;
    }

    send_info(name, email,phoneNumber, age,textArea,selectValue,  errDiv);
}

const form = document.querySelector(".signup-form");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    validateForm();
});
