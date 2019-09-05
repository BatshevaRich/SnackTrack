using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace backend.Controllers
{
    [RoutePrefix("api/calendar")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class calendarController : ApiController
    {
        // GET: api/calendar
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
        [Route("getmonth")]
        [HttpGet]
        // GET: api/calendar/5
        public string Get([FromUri] string id)
        {
            return "value";
        }
        //[Route("getmonth")]
        //[HttpGet]
        //public void getFoodsForMonth(string month)
        //{
        //    int i = 0;
        //}



        // POST: api/calendar
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/calendar/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/calendar/5
        public void Delete(int id)
        {
        }
    }
}
