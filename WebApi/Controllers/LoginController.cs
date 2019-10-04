using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using dal;
namespace WebApi.Controllers
{
    [RoutePrefix("api/login")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LoginController : ApiController
    {
        // GET: api/login
        public IEnumerable<string> Get()
        {
            //Manager.Users("gfdka");
            return new string[] { "value1", "value2" };
        }

        // GET: api/login/5
        public string Get(int id)
        {
            return "value";
        }

        [Route("userlogin")]
        [HttpPost]
        public async Task<IHttpActionResult> PostAsync()
        {
            //string email = "";
            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);
            //List<string> labelsFromFrontend = new List<string>();
            var value = HttpContext.Current.Request.Form["name"];
            var pass = HttpContext.Current.Request.Form["pass"];
            UserManager.Users(value, pass);
            return Ok();

        }

        // PUT: api/login/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/login/5
        public void Delete(int id)
        {
        }
    }
}
