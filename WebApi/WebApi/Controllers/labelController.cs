using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using dal;
namespace WebApi.Controllers
{
    [RoutePrefix("api/label")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class labelController : ApiController
    {
        [HttpGet]
        // GET: api/label
        public List<string> Get()
        {
            return Manager.GetLabels();
        }

        // GET: api/label/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/label
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/label/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/label/5
        public void Delete(int id)
        {
        }
    }
}
