using dal;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
namespace WebApi.Controllers
{
    [RoutePrefix("api/meal")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MealController : ApiController
    {
        // GET: api/meal
        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            List<Meal> results = await Manager.getMeals();
            return Ok(results);
        }

        // GET: api/meal/5
        //[Route("GetMonthMeal")]
        [HttpGet]
        public List<Meal> Get(DateTime dateTime)
        {
            return Manager.getMealsToDay(dateTime);
            //return Manager.GetMonthMeals(dateTime);
        }
        [HttpGet]
        public List<Meal> Get(string label)
        {
            return Manager.getMealsByLabel(label);
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
            DateTime dd = new DateTime();
            try
            {
                dd = DateTime.ParseExact(hour.ToString().Substring(0, hour.IndexOf('+')), "yyyy-MM-ddTHH:mm:ss", null);

            }
            catch
            {
                try
                {
                    dd = DateTime.Parse(hour.Substring(0, hour.IndexOf('G')));
                }
                catch
                {
                    try
                    {
                        dd = DateTime.Parse(hour.Substring(0, hour.IndexOf('T')));
                    }
                    catch
                    {
                        dd = DateTime.Now;
                    }
                   
                }

            }

            Meal meal = new Meal() { DateOfPic = dd, Tags = labelsFromFrontend, Path = path };
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