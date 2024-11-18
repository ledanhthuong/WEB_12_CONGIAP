﻿let currentSlot = 0;
const maxSlots = 5;
const saveButton = document.getElementById("saveButton");
const tableBody = document.querySelector("#imageTable tbody");
let confirmCallback = null; // Callback for confirmations
/**
 * Initialize the page by fetching existing prompts and displaying them.
 */
function initializePage() {
    
    if (!user_id) {
        showNotification("Không tìm thấy team_id. Vui lòng đăng nhập!");
        saveButton.textContent = "Không tìm thấy team_id";
        saveButton.disabled = true;
        return;
    }

    // Fetch existing prompts from the API
    $.ajax({
        url: "http://127.0.0.1:5000/prompts",
        method: "GET",
        success: function (response) {
            const teamPrompts = response.filter(prompt => prompt.team_id === parseInt(user_id, 10));
            currentSlot = teamPrompts.length;


            // Reload saved images and topics
            tableBody.innerHTML = ""; // Clear existing rows
            teamPrompts.forEach((prompt, index) => {
                if (prompt.image) {
                    updateSlot(index + 1, prompt.image);
                    addTableRow(index + 1, prompt.prompt);
                }
            });



            // Update the save button based on remaining slots
            updateSaveButtonText();
        },
        error: function (error) {
            console.error("Lỗi khi tải dữ liệu từ API:", error);
            showNotification("Không thể tải dữ liệu. Vui lòng thử lại!");
        }
    });
}

/**
 * Initialize the page by fetching existing prompts and displaying them.
 */
function initializePage() {
    const teamId = localStorage.getItem("team_id");
    if (!teamId) {
        showNotification("Không tìm thấy team_id. Vui lòng đăng nhập!");
        saveButton.textContent = "Không tìm thấy team_id";
        saveButton.disabled = true;
        return;
    }

    // Fetch existing prompts from the API
    $.ajax({
        url: "http://127.0.0.1:5000/prompts",
        method: "GET",
        success: function (response) {
            const teamPrompts = response.filter(prompt => prompt.team_id === parseInt(teamId, 10));
            currentSlot = teamPrompts.length;

            // Reload saved images and topics
            teamPrompts.forEach((prompt, index) => {
                if (prompt.image) {
                    updateSlot(index + 1, prompt.image);
                    addTableRow(index + 1, prompt.prompt);
                }
            });

            // Update the save button based on remaining slots
            updateSaveButtonText();
        },
        error: function (error) {
            console.error("Lỗi khi tải dữ liệu từ API:", error);
            showNotification("Không thể tải dữ liệu. Vui lòng thử lại!");
        }
    });
}

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
    

    if (!topic || !user_id) {
        showNotification("Câu truy vấn không được để trống!");
        return;
    }

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

    // Prepare request payload
    const request = {
        team_id: user_id,
        prompt: topic,
    };

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

        let progress = 0;
        const interval = setInterval(() => {

            if (progress < 100) {
                progress += 10;

                const progressElement = document.getElementById(`progress-${currentSlot + 1}`);
                if (progressElement) {
                    progressElement.textContent = `${progress}%`;
                }
            }
        }, 800);

        // Send request to create a new prompt
        $.ajax({
            url: "http://127.0.0.1:5000/prompt/create",
            method: "POST",
            data: JSON.stringify(request),
            contentType: "application/json",
            success: function (response) {
                clearInterval(interval);

                setTimeout(() => {
                    progress = 100;
                    const progressElement = document.getElementById(`progress-${currentSlot + 1}`);
                    if (progressElement) {
                        progressElement.textContent = `${progress}%`;
                    }

                    if (response) {
                        const base64String = response.image;
                        updateSlot(currentSlot + 1, base64String); // Cập nhật slot ngay
                        addTableRow(currentSlot + 1, topic); // Cập nhật bảng ngay

                        currentSlot++; // Tăng số lượng slot đã dùng
                        updateSaveButtonText(); // Cập nhật trạng thái nút lưu
                        initializePage();//load hinh len

                    } else {
                        slotElement.innerHTML = "Không thể vẽ hình ảnh. Vui lòng thử lại.";
                        slotElement.classList.remove("loading");
                    }
                }, 800);
            },

            error: function (error) {
                clearInterval(interval);
                slotElement.innerHTML = "Vẽ thất bại!";
                slotElement.classList.remove("loading");
                console.error("Vẽ thất bại:", error);
                showNotification("Vẽ thất bại. Vui lòng thử lại!");
            }
        });
    });
}

/**
 * Update a slot with the generated image.
 * @param {number} slotNumber The slot number.
 * @param {string} base64String The base64 string of the image.
 */
function updateSlot(slotNumber, base64String) {
    const slot = document.querySelector(`.image-slot[data-slot="${slotNumber}"]`);
    if (slot) {
        slot.classList.remove("loading");
        slot.innerHTML = `<img src="data:image/png;base64,${base64String}" alt="Generated Image" onclick="handleSlotClick(this)" />`;
    } else {
        console.error(`Không tìm thấy slot với data-slot="${slotNumber}".`);
    }
}

/**
 * Handle slot click for viewing details (Zoom Image).
 * @param {HTMLImageElement} imgElement The clicked image.
 */
function handleSlotClick(slot) {
    const imgElement = slot.querySelector("img");
    if (imgElement) {
        const modal = document.getElementById("imageModal");
        const modalImage = document.getElementById("modalImage");
        modalImage.src = imgElement.src;
        modal.style.display = "block";

    }
}
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}
window.addEventListener("click", function (event) {
    const modal = document.getElementById("imageModal");
    const modalContent = document.querySelector(".modal-content");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
/**
 * Close the modal view when clicking on the close button.
 */
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
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

    if (remaining <= 0) {
        saveButton.textContent = "Bạn còn 0 lần vẽ";
        saveButton.disabled = true;
        saveButton.classList.add("disabled");
    } else {
        saveButton.textContent = `Bạn còn ${remaining} lần vẽ`;
        saveButton.disabled = false;
        saveButton.classList.remove("disabled");
    }
}

/**
 * Download an image from a slot.
 * @param {number} stt The slot number.
 */
function downloadImage(stt) {
    const slot = document.querySelector(`.image-slot[data-slot="${stt}"] img`);
    if (!slot || !slot.src) {
        showNotification("Không tìm thấy ảnh để tải về!");
        return;
    }

    const link = document.createElement("a");
    link.href = slot.src;
    link.download = `image_slot_${stt}.png`;
    link.click();
}

function submitImages() {
    const selectedImage = document.querySelector('input[name="submitImage"]:checked');
    if (!selectedImage) {
        showNotification("Vui lòng chọn một hình để nộp!");
        return;
    }

    showConfirmation(
        `Bạn có chắc chắn muốn nộp hình STT ${selectedImage.value} ?`,
        () => {
            const request1 = { team_id: user_id };

            // Gọi API đầu tiên để lấy prompt_id với query parameter team_id
            $.ajax({
                url: `http://127.0.0.1:5000/prompts?team_id=${user_id}`, // Fixed URL with query parameter
                method: "GET",
                contentType: "application/json",
                success: function (response) {
                    console.log("Phản hồi từ API /prompts:", response);

                    // Kiểm tra phản hồi và truy cập prompt_id
                    if (response && response.length > 0) {
                        const selectedIndex = selectedImage.value - 1; // Chuyển STT thành chỉ số mảng
                        const promptId = response[selectedIndex]?.prompt_id;

                        if (promptId) {
                            console.log("Prompt ID:", promptId);

                            // Gọi API thứ hai để nộp bài
                            const submissionRequest = { prompt_id: promptId };

                            $.ajax({
                                url: "http://127.0.0.1:5000/submission/create",
                                method: "POST",
                                data: JSON.stringify(submissionRequest),
                                contentType: "application/json",
                                success: function () {
                                    showNotification("Nộp bài thành công!");
                                    window.location.href = "./History";
                                },
                                error: function (error) {
                                    console.error("Lỗi khi nộp bài:", error);
                                    showNotification("Nộp bài thất bại. Vui lòng thử lại.");
                                },
                            });
                        } else {
                            console.error("Không tìm thấy prompt_id tại vị trí được chọn:", selectedIndex);
                            showNotification("Không tìm thấy prompt_id cho hình được chọn. Vui lòng thử lại.");
                        }
                    } else {
                        console.error("Phản hồi API /prompts rỗng hoặc không hợp lệ:", response);
                        showNotification("Không lấy được dữ liệu từ API. Vui lòng thử lại.");
                    }
                },
                error: function (error) {
                    console.error("Lỗi khi gọi API /prompts:", error);
                    showNotification("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc thử lại sau.");
                }
            });
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
// Initialize the page
document.addEventListener("DOMContentLoaded", initializePage);


document.getElementById("username").getElementsByTagName("span")[0].textContent = username;
