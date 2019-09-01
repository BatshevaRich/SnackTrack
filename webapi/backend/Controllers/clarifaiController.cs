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

namespace backend.Controllers
{
    [RoutePrefix("api/clarifai")]
    [EnableCors(origins:"*", headers:"*", methods:"*")]
    public class clarifaiController : ApiController
    {
        ClarifaiClient client = new ClarifaiClient("ca331bf809ea4bb6aaa8bfcd091159c0");
        // GET: api/clarifai
        public async Task<IEnumerable<Label>> GetAsync()
        {
            var res = await client.PublicModels.GeneralModel
                .Predict(new ClarifaiURLImage("https://www.kingarthurflour.com/sites/default/files/recipe_legacy/1496-3-large.jpg"),
                 minValue: 0.8M, maxConcepts: 10)
                .ExecuteAsync()
                ;
            //var res = await client.PublicModels.FoodModel.Predict(
            //        new ClarifaiFileImage(File.ReadAllBytes("C:\\Users\\owner\\Downloads\\download (7).jpg")),
            //         minValue: 0.8M, maxConcepts: 10)
            //    .ExecuteAsync();
            //var res = await client.PublicModels.FoodModel.Predict(
            //                    new ClarifaiFileImage(File.ReadAllBytes("C:\\Users\\owner\\Downloads\\download (7).jpg")),
            //                     minValue: 0.8M, maxConcepts: 10)
            //                .ExecuteAsync();
            List<Label> results = new List<Label>();

            foreach (var concept in res.Get().Data)
            {
                results.Add(new Label() { Name = concept.Name, Probability = concept.Value });

            }
            return results;
        }
        //[HttpGet]
        //     [Route("api/clarifai/GetAsync")]

        // GET: api/clarifai/ 
        public async Task<IEnumerable<Label>> GetAsync(string path)
        {
            var res = await client.PublicModels.FoodModel.Predict(
                    new ClarifaiFileImage(File.ReadAllBytes(path)),
                     minValue: 0.8M, maxConcepts: 10)
                .ExecuteAsync();

            List<Label> results = new List<Label>();

            foreach (var concept in res.Get().Data)
            {
                results.Add(new Label() { Name = concept.Name, Probability = concept.Value });

            }
            return results;
        }

        // POST: api/clarifai
        public void Post([FromBody]string value)
        {
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
