using Microsoft.AspNetCore.Mvc;

namespace ChatGPT_12_CONGIAP.Controllers
{
    public class HistoryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
