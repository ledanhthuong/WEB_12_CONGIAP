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

    // Check if topic or teamId is empty
    if (!topic || !teamId) {
        showNotification("Không được để trống!");
        return;
    }

    // Prepare request payload
    const request = {
        team_id: teamId,
        prompt: topic,
    };

    // Check word limit
    const words = topic.split(/\s+/).filter(word => word !== "");

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
        const slotElement = document.querySelector(`.image-slot[data-slot="${currentSlot + 1}"]`);

        if (!slotElement) {
            showNotification("Không tìm thấy slot hình!");
            return;
        }

        // Add loading indicator
        slotElement.innerHTML = `<div class="loading-indicator">Đang vẽ... <span id="progress-${currentSlot + 1}">0%</span></div>`;
        slotElement.classList.add("loading");

        // Track loading progress
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 90) {
                progress += 10; // Increment progress up to 90%
                const progressElement = document.getElementById(`progress-${currentSlot + 1}`);
                if (progressElement) {
                    progressElement.textContent = `${progress}%`;
                }
            }
        }, 500);

        // Send AJAX request
        const startTime = Date.now();
        $.ajax({
            url: "http://127.0.0.1:5000/prompt/create",
            method: "POST",
            data: JSON.stringify(request),
            contentType: "application/json",
            success: function (response) {
                clearInterval(interval); // Clear progress interval

                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, 5000 - elapsedTime); // Ensure a minimum 5-second duration

                setTimeout(() => {
                    // Complete progress and display image
                    progress = 100;
                    const progressElement = document.getElementById(`progress-${currentSlot + 1}`);
                    if (progressElement) {
                        progressElement.textContent = `${progress}%`;
                    }

                    if (response) {
                        const base64String = response;
                        updateSlot(currentSlot + 1, base64String);

                        currentSlot++;
                        updateSaveButtonText();
                        addTableRow(currentSlot, topic);
                    } else {
                        slotElement.innerHTML = "Không thể vẽ hình ảnh. Vui lòng thử lại.";
                        slotElement.classList.remove("loading");
                        alert("Không thể vẽ hình ảnh. Vui lòng thử lại.");
                    }
                }, remainingTime);
            },
            error: function (error) {
                clearInterval(interval); // Clear progress interval
                slotElement.innerHTML = "Vẽ thất bại!";
                slotElement.classList.remove("loading");
                console.error("Vẽ thất bại", error);
                alert("Vẽ thất bại. Vui lòng kiểm tra lại thông tin!");
            },
        });
    });
}

/**
* Update a slot with the generated image.
* @param {number} slotNumber The slot number.
* @param {string} base64String The base64 image string.
*/
function updateSlot(slotNumber, base64String) {
    const slot = document.querySelector(`.image-slot[data-slot="${slotNumber}"]`);

    if (slot) {
        slot.classList.remove("loading");
        slot.innerHTML = `<img src="data:image/png;base64,${base64String}" alt="Generated Image" />`;
    } else {
        console.error(`Slot with data-slot="${slotNumber}" not found.`);
    }
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
function downloadImage(stt) {
    // Tìm ảnh tương ứng trong slot
    const slot = document.querySelector(`.image-slot[data-slot="${stt}"] img`);

    if (!slot || !slot.src) {
        showNotification("Không tìm thấy ảnh để tải về!");
        return;
    }

    // Tạo một thẻ <a> để tải ảnh
    const link = document.createElement("a");
    link.href = slot.src; // Đường dẫn ảnh (base64)
    link.download = `image_slot_${stt}.png`; // Tên file khi tải
    link.click(); // Tự động kích hoạt tải ảnh
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