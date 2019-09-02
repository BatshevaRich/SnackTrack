using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using dal;
using backend.Models;
namespace backend.Controllers
{
    public class mealController : ApiController
    {
        // GET: api/meal
        public List<Meal> Get()
        {
            return Manager.getAllMeals();
        }

        // GET: api/meal/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/meal
        public void Post([FromBody]string value)
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
