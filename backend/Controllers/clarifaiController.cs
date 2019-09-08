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
using Clarifai.DTOs.Predictions;
using backend.Models;
using System.Web;

namespace backend.Controllers
{
    public class clarifaiController : ApiController
    {
        ClarifaiClient client = new ClarifaiClient("ca331bf809ea4bb6aaa8bfcd091159c0");
        [HttpGet]
        // GET: api/clarifai
        public async Task<IEnumerable<Label>> GetAsync()
        {
            //var imageDataByteArray = Convert.FromBase64String(path);
            //var res = await client.PublicModels.FoodModel.Predict(
            //        new ClarifaiFileImage(File.ReadAllBytes(path)),
            //         minValue: 0.8M, maxConcepts: 10)
            //    .ExecuteAsync();

            List<Label> results = new List<Label>();

            //foreach (var concept in res.Get().Data)
            //{
            //    results.Add(new Label() { Name = concept.Name, Probability = concept.Value });

            //}
            return results;
        }

        // GET: api/clarifai/5
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
