//have to arrange with backend about the slot
    let currentSlot = 0;
    const maxSlots = 5;
    const saveButton = document.getElementById("saveButton");
    const tableBody = document.querySelector("#imageTable tbody");
    let confirmCallback; // Hàm callback được gọi khi xác nhận

    // Hiển thị thông báo
    function showNotification(message, callback = null, duration = 3000) {
            const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notificationMessage");
    const notificationButtons = document.getElementById("notificationButtons");

    // Cập nhật nội dung thông báo
    notificationMessage.textContent = message;

    // Kiểm tra xem có cần nút xác nhận không
    if (callback) {
        notificationButtons.classList.remove("hidden");
    confirmCallback = callback;
            } else {
        notificationButtons.classList.add("hidden");
                // Tự động ẩn thông báo sau một khoảng thời gian
                setTimeout(() => {
        notification.classList.remove("visible");
                }, duration);
            }

    // Hiển thị thông báo
    notification.classList.add("visible");
        }

    // Xác nhận hành động
    function confirmAction() {
            if (confirmCallback) confirmCallback();
    hideNotification();
        }

    // Hủy hành động
    function cancelAction() {
        hideNotification();
        }

    // Ẩn thông báo
    function hideNotification() {
            const notification = document.getElementById("notification");
    notification.classList.remove("visible");
        }

    // Cập nhật hàm saveTopic để dùng thông báo và xác nhận
    function saveTopic() {
            const topic = document.getElementById("imageTopic").value.trim();

    if (!topic) {
        showNotification("Vui lòng nhập đề tài trước khi vẽ!");
    return;
            }

            if (currentSlot >= maxSlots) {
        showNotification("Bạn đã sử dụng hết lượt vẽ!");
    return;
            }

    showNotification(
    `Bạn có chắc muốn vẽ với đề tài với nội dùng này "${topic} không "?`,
                () => {
                    const slot = document.querySelector(`.image-slot[data-slot="${currentSlot + 1}"]`);
    slot.textContent = `Topic: ${topic}`;
    slot.classList.add("filled");
    currentSlot++;
    updateSaveButtonText();
    addTableRow(currentSlot, topic);
    showNotification("Đề tài đã được lưu thành công!");
                }
    );
        }


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

    function updateSaveButtonText() {
            const remaining = maxSlots - currentSlot;
    saveButton.textContent = `Bạn còn ${remaining} lần vẽ`;
        }

    function handleSlotClick(slot) {
            if (slot.classList.contains("filled")) {
                const modal = document.getElementById("imageModal");
    const modalText = document.getElementById("modalText");
    modalText.textContent = slot.textContent;
    modal.style.display = "block";
            }
        }

    function closeModal() {
        document.getElementById("imageModal").style.display = "none";
        }

    window.onclick = function (event) {
            const modal = document.getElementById("imageModal");
    if (event.target === modal) {
        closeModal();
            }
        };

    function downloadImage(stt) {
            const link = document.createElement("a");
    link.href = `https://via.placeholder.com/150?text=Hinh+${stt}`;
    link.download = `Hinh_${stt}.png`;
    link.click();
        }

    function submitImages() {
            const selectedImage = document.querySelector('input[name="submitImage"]:checked');
    const videoLink = document.getElementById("videoLink").value.trim();

    if (!selectedImage) {
        alert("Vui lòng chọn một hình để nộp!");
    return;
            }

    if (!videoLink) {
        alert("Vui lòng nhập link video của bạn!");
    return;
            }

    alert(`Bạn đã nộp hình: STT ${selectedImage.value} với link video: ${videoLink}`);
        }
    updateSaveButtonText();
