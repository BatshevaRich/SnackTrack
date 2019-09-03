using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using Clarifai.API;
using Clarifai.DTOs.Inputs;
using System.IO;
using System.Web.Http.Cors;
using Clarifai.DTOs.Predictions;
using backend.Models;
using System.Web;
using System.Text;
using System.Drawing;
using dal;
namespace backend.Controllers
{
    [RoutePrefix("api/meal")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class mealController : ApiController
    {
        // GET: api/meal
        //[Route("get")]
        [HttpGet]
        public List<Meal> Get()
        {

            //Manager.UploadFile("dietdiaryfoodpics", "C:\\Users\\owner\\Downloads\\download (6).jpg", "bread.jpg");

            return Manager.getAllMeals();
        }

        // GET: api/meal/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/meal
        public void Post([FromBody]Meal value)
        {

        }

        // PUT: api/meal/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/meal/5
        public void Delete(int id)
        {
        }
    }
}
