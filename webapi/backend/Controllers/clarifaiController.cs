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

namespace backend.Controllers
{
    [RoutePrefix("api/clarifai")]
    [EnableCors(origins:"*", headers:"*", methods:"*")]
    public class clarifaiController : ApiController
    {
        ClarifaiClient CLARIFAI_API_URL = new ClarifaiClient("ca331bf809ea4bb6aaa8bfcd091159c0");
        // GET: api/clarifai
        public async Task<List<Label>> GetAsync()
        {
            var res = await CLARIFAI_API_URL.PublicModels.FoodModel.Predict(
                    new ClarifaiURLImage("https://www.kingarthurflour.com/sites/default/files/recipe_legacy/1496-3-large.jpg"),
                     minValue: 0.8M, maxConcepts: 10)
                .ExecuteAsync();

            List<Label> results = new List<Label>();

            foreach (var concept in res.Get().Data)
            {
                results.Add(new Label() { Name = concept.Name, Probability = concept.Value });

            }
            return results;
        }

        public List<Label> Results { get; set; }

        [Route("InsertImages")]
        [HttpGet]
        public List<Label> getResults()
        {
            return Results;
        }

        // GET: api/clarifai/ 
        public async Task<List<Label>> GetAsync(byte[] path)
        {
            var res = await CLARIFAI_API_URL.PublicModels.FoodModel.Predict(
                    new ClarifaiFileImage(path),
                     minValue: 0.8M, maxConcepts: 10)
                .ExecuteAsync();

            Results = new List<Label>();

            foreach (var concept in res.Get().Data){
                Results.Add(new Label() { Name = concept.Name, Probability = concept.Value });

            }
            return Results;
        }
        [Route("InsertImages")]
        [HttpPost]
        public async Task<IHttpActionResult> InsertImagesAsync()
        {
            var httpRequest = HttpContext.Current.Request;

            if (httpRequest.Files.Count > 0)
            {
                for (var i = 0; i < httpRequest.Files.Count; i++)
                {
                    var postedFile = httpRequest.Files[i];;
                }

            }
            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);
            foreach (var file in provider.Contents)
            {
                using (HttpClient client = new HttpClient())
                {
                    var filename = file.Headers.ContentDisposition.FileName.Trim('\"');
                    var buffer = await file.ReadAsByteArrayAsync();
                    
                    //string encodedData = Convert.ToBase64String(buffer);
                    Results = await GetAsync(buffer);
                }
            }
            //Request.CreateResponse<IEnumerable<Label>>(HttpStatusCode.OK, results);
            return Ok(Results);
        }

        // PUT: api/clarifai/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/clarifai/5
        public void Delete(int id)
        {
        }
    }
}
