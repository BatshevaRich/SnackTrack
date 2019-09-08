using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using dal;

namespace backend.Controllers
{
    [RoutePrefix("api/Labels")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LabelsController : ApiController
    {
        [HttpGet]
        // GET: api/Labels
        public List<string> Get()
        {
            return Manager.GetLabels();
        }

        // GET: api/Labels/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Labels
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Labels/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Labels/5
        public void Delete(int id)
        {
        }
    }
}
