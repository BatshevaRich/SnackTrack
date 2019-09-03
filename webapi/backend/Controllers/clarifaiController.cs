using backend.Models;
using Clarifai.API;
using Clarifai.DTOs.Inputs;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace backend.Controllers
{
    [RoutePrefix("api/clarifai")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class clarifaiController : ApiController
    {
        ClarifaiClient CLARIFAI_API_URL = new ClarifaiClient("ca331bf809ea4bb6aaa8bfcd091159c0");
        // GET: api/clarifai
        [Route("getasync")]
        [HttpGet]
        public async Task<List<Label>> GetAsync()
        {//basic get function, does not get any parameters.
            //only for testing purposes.
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

        // GET: api/clarifai/ 
        /// <summary>GetAsync is the main 'get' function, used by the post.
        /// <param name="path">Used as base64 image, sent to clarifai api</param>
        /// </summary>
        /// <returns>list of labels from clarifai api</returns>
        public async Task<List<Label>> GetAsync(byte[] path)
        {
            var res = await CLARIFAI_API_URL.PublicModels.FoodModel.Predict(
                    new ClarifaiFileImage(path),
                     minValue: 0.8M, maxConcepts: 10)
                .ExecuteAsync();
            List<Label> Results = new List<Label>();
            foreach (var concept in res.Get().Data)
            {
                Results.Add(new Label() { Name = concept.Name, Probability = concept.Value });

            }
            return Results;
        }

        /// <summary>InsertImagesAsync is the main function of this controller, used to
        /// return the labels from clarifai api to the frontend.
        /// gets image from body of http post
        /// </summary>
        /// <returns>httpactionresult, with labels in body of message</returns>
        [Route("InsertImages")]
        [HttpPost]
        public async Task<IHttpActionResult> InsertImagesAsync()
        {
            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);
            List<Label> Results = new List<Label>();
            foreach (var file in provider.Contents)
            {
                var buffer = await file.ReadAsByteArrayAsync();
                Results = await GetAsync(buffer);
            }
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
