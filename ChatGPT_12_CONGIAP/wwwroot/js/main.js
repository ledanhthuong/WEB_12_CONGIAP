
document.getElementById('loadUsers').addEventListener('click', function () {
    fetch('http://127.0.0.1:5000/user') // Your Flask API URL
        .then(response => response.json()) // Parse JSON data
        .then(data => {
            const users = data; // Your fetched data
            const tableBody = document.querySelector('#userTable tbody');
            tableBody.innerHTML = ''; // Clear existing table data

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                                    <td>${user.user_id}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.group_id}</td>
                                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
});

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