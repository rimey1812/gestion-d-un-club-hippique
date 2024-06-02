const userLoggedIn = localStorage.getItem('isLoggedIn');

if (!userLoggedIn) {
    document.addEventListener('click', function(event) {
        window.location.href = '../login & signup/login.html';
    });
}



const userData = JSON.parse(localStorage.getItem('userData'));
const isAdmin = userData.isAdmin;


if (!isAdmin) {
    window.location.href = '../home/home.html';
}

 

let lougout = document.querySelector(".logout");
lougout.addEventListener('click',function(){
    localStorage.clear();
    setTimeout(()=>{
        window.location = "../login & signup/login.html"
    } , 1500)   
})


const photoProfileUrl = userData.photoProfileUrl;
const profileImg = document.querySelector('.profile-img');
profileImg.style.backgroundImage = `url(${photoProfileUrl})`;  




