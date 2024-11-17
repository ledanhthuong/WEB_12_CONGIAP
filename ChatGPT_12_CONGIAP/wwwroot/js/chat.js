let currentSlot = 0;
let slot = 1;
const maxSlots = 5;
const saveButton = document.getElementById("saveButton");
const tableBody = document.querySelector("#imageTable tbody");
let confirmCallback = null; // Callback for confirmations

/**
 * Show a notification.
 * @param {string} message The notification message.
 * @param {number} duration Auto-dismiss duration (in ms). Default: 3000ms.
 */
function showNotification(message, duration = 3000) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notificationMessage");
    notificationMessage.textContent = message;
    notification.classList.add("visible");

    // Auto-hide the notification
    setTimeout(() => {
        notification.classList.remove("visible");
    }, duration);
}

/**
 * Show a confirmation modal with actions.
 * @param {string} message The confirmation message.
 * @param {function} callback Function to execute on confirmation.
 */
function showConfirmation(message, callback) {
    confirmCallback = callback;
    const confirmModal = document.getElementById("notification");
    const notificationMessage = document.getElementById("notificationMessage");
    const notificationButtons = document.getElementById("notificationButtons");

    // Update modal content
    notificationMessage.textContent = message;
    notificationButtons.classList.remove("hidden");

    confirmModal.classList.add("visible");
}

/**
 * Handle the Confirm button click.
 */
function confirmAction() {
    if (confirmCallback) {
        confirmCallback(); // Execute the callback
    }
    hideNotification();
}

/**
 * Handle the Cancel button click.
 */
function cancelAction() {
    hideNotification();
}

/**
 * Hide the notification or confirmation modal.
 */
function hideNotification() {
    const notification = document.getElementById("notification");
    const notificationButtons = document.getElementById("notificationButtons");

    notification.classList.remove("visible");
    notificationButtons.classList.add("hidden");
    confirmCallback = null; // Reset callback
}

/**
 * Save the topic for a drawing.
 */
function saveTopic() {
    const topic = document.getElementById("imageTopic").value.trim();
    const teamId = localStorage.getItem("team_id");

    // Kiểm tra nếu email hoặc password trống
    if (!topic || !teamId) {
        alert("Câu Truy Vẫn không được để trống!");
        return;
    }

    // Chuẩn bị payload cho request
    const request = {
        team_id: teamId,
        prompt: topic,
    };
    console.log("Login successful", teamId, topic);


    // Gửi yêu cầu AJAX
    $.ajax({
        url: "http://127.0.0.1:5000/prompt/create", // URL API
        method: "POST",
        data: JSON.stringify(request),
        contentType: "application/json",
        success: function (response) {
            console.log("Login successful", response);

            // Kiểm tra và xử lý 
            if (response) {
                const base64String = response;
                updateSlot(currentSlot, base64String);

                slot++;
                if (currentSlot > 5) {
                    //khóa không cho nhập
                }

            } else {
                alert("Không thể vẽ hình ảnh. Vui lòng thử lại.");
            }
        },
        error: function (error) {
            console.error("Vẽ thất bại", error);
            alert("Vẽ thất bại. Vui lòng kiểm tra lại thông tin!");
        },
    });

function updateSlot(slotNumber, base64String) {
    // Tìm slot dựa trên data-slot
    const slot = document.querySelector(`.image-slot[data-slot="${slotNumber}"]`);

    if (slot) {
        // Nếu là <img>, cập nhật src
        if (slot.tagName.toLowerCase() === 'img') {
            slot.src = 'data:image/png;base64,' + base64String;
        } else {
            // Nếu là <div>, thay đổi nội dung thành hình ảnh
            slot.innerHTML = `<img src="data:image/png;base64,${base64String}" alt="Generated Image" />`;
        }
    } else {
        console.error(`Slot with data-slot="${slotNumber}" not found.`);
    }
}


    const words = topic.split(/\s+/).filter(word => word !== ""); // Word count

    if (!topic) {
        showNotification("Vui lòng nhập đề tài trước khi vẽ!");
        return;
    }

    if (words.length > 1000) {
        showNotification("Đề tài không được vượt quá 1000 từ. Vui lòng chỉnh sửa lại!");
        return;
    }

    if (currentSlot >= maxSlots) {
        showNotification("Bạn đã sử dụng hết lượt vẽ!");
        return;
    }

    // Show confirmation before saving
    showConfirmation(`Bạn có chắc muốn vẽ với đề tài "${topic}" không?`, () => {
        const slot = document.querySelector(`.image-slot[data-slot="${currentSlot + 1}"]`);
        slot.textContent = `Topic: ${topic}`;
        slot.classList.add("filled");

        currentSlot++;
        updateSaveButtonText();
        addTableRow(currentSlot, topic);

        showNotification("Đề tài đã được lưu thành công!");
    });
}

/**
 * Add a new row to the table for the saved topic.
 * @param {number} stt The slot number.
 * @param {string} topic The topic description.
 */
function addTableRow(stt, topic) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${stt}</td>
            <td>${topic}</td>
            <td>Hình ${stt}</td>
            <td><button onclick="downloadImage(${stt})">Tải về</button></td>
            <td><input type="radio" name="submitImage" value="${stt}"></td>
        `;
    tableBody.appendChild(row);
}

/**
 * Update the save button text based on remaining slots.
 */
function updateSaveButtonText() {
    const remaining = maxSlots - currentSlot;
    saveButton.textContent = `Bạn còn ${remaining} lần vẽ`;
}

/**
 * Handle slot click for viewing details.
 * @param {HTMLElement} slot The clicked slot.
 */
function handleSlotClick(slot) {
    const imgElement = slot.querySelector("img");
    if (imgElement) {
        const modal = document.getElementById("imageModal");
        const modalImage = document.getElementById("modalImage");
        modalImage.src = imgElement.src;
        modal.style.display = "block";
    } else {
        showNotification("Không có hình ảnh để phóng to!");
    }
}
/**
* Close the modal view when clicking on the close button.
*/
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

/**
 * Prevent the modal from closing when clicking outside of the modal content.
 */
window.addEventListener("click", function (event) {
    const modal = document.getElementById("imageModal");
    const modalContent = document.querySelector(".modal-content");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


/**
 * Submit the selected images and video link.
 */
function submitImages() {
    const selectedImage = document.querySelector('input[name="submitImage"]:checked');
    const videoLink = document.getElementById("videoLink").value.trim();
    const errorMessage = document.getElementById('errorMessage');

    // Clear previous error message
    if (errorMessage) errorMessage.textContent = '';

    // Kiểm tra nếu chưa chọn hình ảnh
    if (!selectedImage) {
        showNotification("Vui lòng chọn một hình để nộp!");
        return;
    }

    // Kiểm tra nếu link video chưa được nhập
    if (!videoLink) {
        showNotification("Vui lòng nhập link video của bạn!");
        return;
    }

    // Regex để kiểm tra link YouTube
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoLink.match(youtubeRegex);

    if (!match || !match[1]) {
        showNotification('Link không hợp lệ. Vui lòng nhập link YouTube đúng.');
        return;
    }

    const videoId = match[1];

    // Hiển thị xác nhận trước khi nộp bài
    showConfirmation(
        `Bạn có chắc chắn muốn nộp hình STT ${selectedImage.value} với link video: ${videoLink}?`,
        () => {
            showNotification(`Bạn đã nộp hình STT ${selectedImage.value} với link video: ${videoLink}`);
            // Chuyển hướng đến trang khác nếu cần
            window.location.href = `page2.html?videoId=${videoId}`;
        }
    );
}


/**
 * Word limit check for the textarea.
 * @param {HTMLTextAreaElement} textarea The textarea element.
 * @param {number} maxWords The maximum allowed words.
 */
function checkWordLimit(textarea, maxWords) {
    const wordCountElement = document.getElementById("wordCount");
    const words = textarea.value.trim().split(/\s+/).filter(word => word !== ""); // Word count

    if (words.length > maxWords) {
        wordCountElement.style.color = "red"; // Warning
    } else {
        wordCountElement.style.color = "#888"; // Normal
    }

    wordCountElement.textContent = `${words.length}/${maxWords} từ`;
}


// Initialize save button text
updateSaveButtonText();