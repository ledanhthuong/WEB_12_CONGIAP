// Kiểm tra nếu "username" có trong cookie
let username = Cookies.get('username');
let user_id = Cookies.get('user_id');
let group_id = Cookies.get('group_id');

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
    // Remove cookies
    Cookies.remove('username');
    Cookies.remove('user_id');
    Cookies.remove('group_id');

    // Redirect to Login page
    window.location.href = "./Login";
}

// Button to top
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

// Kiểm tra nếu "username" có trong cookie
if (username && user_id) {
    console.log("Username and Team ID are already in cookie.");
    // Thực hiện hành động khi đã có giá trị trong localStorage
} else {
    console.log("No username or team ID found in cookie.");
    // Thực hiện hành động khi không có giá trị trong localStorage
    window.location.href = "./Login";
}

// Thay đổi nội dung của thẻ <span> bên trong phần tử có ID "username"
document.getElementById("username").getElementsByTagName("span")[0].textContent = username;
