using Google.Cloud.Storage.V1;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using backend.Models;

namespace dal
{
    public static class Manager
    {
        private static dbDietDairyEntities db = new dbDietDairyEntities();
        public static string path = "https://storage.cloud.google.com/";

        public static void addMeal(Meal meal)
        {
            db.meal.Add(Mapper.convertMealToEntity(meal));
            db.SaveChanges();

        }
        public static string UploadFile(string bucketName, string localPath, string objectName = null)
        {
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "C:\\key\\DietDairyYL-115c5b2b586f.json");
            var env = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS");
            Console.WriteLine($"env {env}");

            var storage = StorageClient.Create();
            using (var f = File.OpenRead(localPath))
            {
                objectName = objectName ?? Path.GetFileName(localPath);
                var x = storage.UploadObject(bucketName, objectName, null, f);
                Console.WriteLine($"Uploaded {objectName}.");
            }
            return path + bucketName + "/" + objectName;

        }
        public static List<object> getAllMeals()
        {
            List<meal> listMealsEntity;
            listMealsEntity = db.meal.ToList<meal>();
            List<object/*api obj*/> listMeals = listMealsEntity.Select<meal, object>(m => Mapper.convertEntityToMeal(m)).ToList<Object>();//listMealsEntity.Select<meal,object/*api obj*/>(Mapper.convertEntityToMeal);
            return listMeals;
        }

       
    }
}