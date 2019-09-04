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
        [HttpGet]
        public List<Meal> Get()
        {
            return Manager.getAllMeals();
        }

        // GET: api/meal/5
        public string Get(int id)
        {
            return "value";
        }
        /// <summary>
        /// function to add the picture to storage, and add labels + imagepath to db.
        /// calls function that deals with adding.
        /// </summary>
        /// <returns></returns>
        [Route("upload")]
        [HttpPost]
        // POST: api/meal
        public async Task<IHttpActionResult> InsertImagesAsync()
        {   
            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);
            List<string> labelsFromFrontend = new List<string>();
            var path = HttpContext.Current.Request.Form["path"];
            var hour = HttpContext.Current.Request.Form["hour"];
            var labels = HttpContext.Current.Request.Form["labels"];
            foreach (var item in labels.Split(',').ToList())
            {
                labelsFromFrontend.Add(item);
            }
            Meal meal = new Meal() { DateOfPic = DateTime.Now, Labels = labelsFromFrontend, Path = path };
            Manager.addMeal(meal);
            return Ok();
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
