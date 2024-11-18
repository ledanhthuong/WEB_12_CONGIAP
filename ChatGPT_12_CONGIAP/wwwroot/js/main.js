

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function viewProfile() {
    alert("Displaying profile information...");
}

function viewGameHistory() {
    alert("Displaying game history...");
}

function dangXuat() {
    alert("Logging out...");
}

//button to top

window.onscroll = function () {
    toggleToTopButton();
};

function toggleToTopButton() {
    const toTopBtn = document.getElementById("toTopBtn");
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
        toTopBtn.style.display = "block";
    } else {
        toTopBtn.style.display = "none";
    }
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Kiểm tra nếu "username" có trong localStorage
const username = localStorage.getItem("username");
const teamId = localStorage.getItem("team_id");

if (username && teamId) {
    console.log("Username and Team ID are already in localStorage.");
    // Thực hiện hành động khi đã có giá trị trong localStorage
} else {
    console.log("No username or team ID found in localStorage.");
    // Thực hiện hành động khi không có giá trị trong localStorage
    window.location.href = "./Login";
}

// Thay đổi nội dung của thẻ <span> bên trong phần tử có ID "username"
document.getElementById("username").getElementsByTagName("span")[0].textContent = username;

function dangXuat() {


    localStorage.removeItem('username');
    localStorage.removeItem('team_id');
  
        window.location.href = "./Login";
    
}
