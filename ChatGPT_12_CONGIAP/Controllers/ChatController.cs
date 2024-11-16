using ChatGPT_12_CONGIAP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace ChatGPT_12_CONGIAP.Controllers
{
    public class ChatController(ILogger<ChatController> logger) : Controller
    {
        private readonly ILogger<ChatController> _logger = logger;

        public IActionResult Index()
        {
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
