//get the student information
async function getSinhVien() {
    const url = 'https://localhost:44345/sinhvien/getSv';

    try {
        const response = await fetch(url);
        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const datas = await response.json();
        const email = localStorage.getItem('username');
        for (const data of datas) { // Fixed the iteration here
            if (data.email === email) {
                StudentData(data);
                break; // If you only need to find one match then break
            }
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}
function StudentData(data) {
    //check data is not null
    if (!data) return;

    // Update text content of labels
    document.querySelector("#name").textContent = data.full_name || '';
    document.querySelector("#mssv").textContent = data.mssv || '';

    // Format the birthday date
    if (data.birthday) {
        const birthday = new Date(data.birthday);
        const formattedBirthday = [
            birthday.getFullYear(),
            ('0' + (birthday.getMonth() + 1)).slice(-2),
            ('0' + birthday.getDate()).slice(-2)
        ].join('-');
        document.querySelector("#dob").textContent = formattedBirthday;
    } else {
        document.querySelector("#dob").textContent = '';
    }

    document.querySelector("#major").textContent = data.major || '';
    document.querySelector("#nationality").textContent = data.nationality || '';
    document.querySelector("#email").textContent = data.email || '';
    document.querySelector("#khoa").textContent = data.faculty || '';
    document.querySelector("#gender").textContent = data.gender || '';
    document.querySelector("#religion").textContent = data.religion || '';
    document.querySelector("#id-card-number").textContent = data.idcard || '';

    // Format the date of issue
    if (data.dateofissue) {
        const dateOfIssue = new Date(data.dateofissue);
        const formattedDateOfIssue = [
            dateOfIssue.getFullYear(),
            ('0' + (dateOfIssue.getMonth() + 1)).slice(-2),
            ('0' + dateOfIssue.getDate()).slice(-2)
        ].join('-');
        document.querySelector("#dou").textContent = formattedDateOfIssue;
    } else {
        document.querySelector("#dou").textContent = '';
    }

    document.querySelector("#Place").textContent = data.placeofissue || '';
    document.querySelector("#mobNo").textContent = data.myphone || '';
    document.querySelector("#parentMobNo").textContent = data.parentphone || '';
    document.querySelector("#address").textContent = data.address || '';
    document.querySelector("#thongtin").textContent = data.aboutstudent || '';

    // Update image source
    const imageElement = document.getElementById("student-image");
    if (data.picture) {
        imageElement.src = data.picture;
    } else {
        alert("Image source is not available.");
        imageElement.src = "/img/thuong.jpg"; // Use default image
    }
}





window.onload = function () {
    getSinhVien();
};

function viewStudentDetails() {
    // Navigate to the student details page
    window.location.href = './Student_Infor'; // Change this URL to the correct page for your application
    getSinhVien();
}
function addStudentDetails() {
    // Navigate to the student details page
    window.location.href = './Student_Update_Data'; // Change this URL to the correct page for your application
    getSinhVien();
}