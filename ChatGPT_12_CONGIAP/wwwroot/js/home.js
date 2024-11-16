const titles = [
    "Cuộc thi Vẽ tranh cùng AI 2024",
    "Khám phá tài năng vẽ AI",
    "Thể hiện phong cách nghệ thuật của bạn"
];

const announcements = [
    "🌟 Hãy nhanh tay tham gia cuộc thi để nhận nhiều phần quà hấp dẫn và cơ hội trình diễn tài năng của bạn! 🌟",
    "🎨 Tham gia cuộc thi vẽ tranh AI và thể hiện phong cách nghệ thuật độc đáo của bạn! 🎨",
    "🖌️ Cuộc thi nghệ thuật mở ra cho tất cả những ai đam mê sáng tạo với AI! 🖌️"
];

let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = slides.children.length;

    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    const offset = -currentSlide * 100;
    slides.style.transform = `translateX(${offset}%)`;

    // Update title and announcement text based on the current slide
    document.getElementById('banner-title').textContent = titles[currentSlide];
    document.getElementById('banner-announcement').textContent = announcements[currentSlide];
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

setInterval(() => {
    nextSlide();
}, 5000);



function goToDrawingContest() {
    // Kiểm tra nếu trang đích có thể truy cập
    window.location.href = 'exam.html'; // Đường dẫn phải chính xác
}
