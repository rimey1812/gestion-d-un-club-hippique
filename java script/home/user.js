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

const userData = JSON.parse(localStorage.getItem('userData'));
const isAdmin = userData.isAdmin;
if (isAdmin) {
    window.location.href = '../admin/admin.html';
}