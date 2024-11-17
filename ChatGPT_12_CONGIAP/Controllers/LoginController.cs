using Microsoft.AspNetCore.Mvc;

namespace ChatGPT_12_CONGIAP.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        // Giả sử có một hành động đăng nhập
        public IActionResult Login(string userId, string userName)
        {
            // Giả định bạn đã kiểm tra thông tin người dùng hợp lệ
            if (!string.IsNullOrEmpty(userId) && !string.IsNullOrEmpty(userName))
            {
                // Lưu thông tin vào session
                HttpContext.Session.SetString("UserId", userId);
                HttpContext.Session.SetString("UserName", userName);

                // Sau khi lưu vào session, bạn có thể chuyển hướng người dùng đến một trang khác
                return RedirectToAction("Index");
            }

            // Nếu thông tin không hợp lệ, bạn có thể hiển thị lại trang đăng nhập
            return View("Index");
        }

        public IActionResult Logout()
        {
            // Xóa thông tin session khi người dùng đăng xuất
            HttpContext.Session.Remove("UserId");
            HttpContext.Session.Remove("UserName");

            // Chuyển hướng về trang login sau khi đăng xuất
            return RedirectToAction("Index");
        }
    }
}
