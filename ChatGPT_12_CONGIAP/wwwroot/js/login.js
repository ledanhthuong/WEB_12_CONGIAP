// Login request
async function loginRequest() {
    
}

// Hàm gọi API để tìm kiếm group_id dựa trên user_id
async function getGroupId(userId) {
    const apiUrl = `https://localhost:5000/user`;

    try {
        // Gửi request tới API
        const response = await fetch(apiUrl, {
            method: 'POST', // Hoặc 'GET' nếu API yêu cầu phương thức khác
            headers: {
                'Content-Type': 'application/json' // Cấu hình Content-Type
            },
            body: JSON.stringify({ user_id: userId }) // Truyền user_id trong body (nếu POST)
        });

        // Kiểm tra trạng thái phản hồi
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Chuyển đổi kết quả trả về thành JSON
        const data = await response.json();

        // Trả về group_id từ dữ liệu trả về
        return data.group_id;
    } catch (error) {
        console.error('Error fetching group_id:', error);
        return null; // Xử lý lỗi và trả về giá trị mặc định nếu thất bại
    }
}



//Check login
document.querySelector('.login-form button').addEventListener('click', function (e) {

    try {
        // Get the email and password input elements
        const emailInput = document.getElementById("username_login");
        const passwordInput = document.getElementById("password_login");

        // Extract values and trim whitespace
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Check if email and password are not empty
        if (!email || !password) {
            showErrorToast("Email and password are required");
            return;
        }

        // Create the JSON payload
        const request = {
            email: email,
            password: password
        };

        // Make an AJAX request using the Fetch API
        const response = await fetch('https://localhost:5000/user/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(request)
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Login failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Call getGroupId to fetch the group_id
        const groupId = await getGroupId(data.user_id);

        // Redirect based on group_id
        switch (groupId) {
            case 0:
            case 1:
            case 2:
                window.location.href = '/Home';
                break;
            default:
                window.location.href = '/Home'; // Default redirection if group_id is unknown
                break;
        }
    } catch (error) {
        // Handle errors that occur during the login process
        console.error('Error during login request:', error);
        showErrorToast('An error occurred during login. Please try again.');
    }

    e.preventDefault(); // Prevent default form submission

    const formContainer = document.querySelector('.form');

    // Add animation class
    formContainer.classList.add('fade-out');

});

