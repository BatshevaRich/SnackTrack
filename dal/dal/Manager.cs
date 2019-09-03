using backend.Models;
using Google.Cloud.Storage.V1;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace dal
{
    public static class Manager
    {
        private static dbDietDairyEntities db = new dbDietDairyEntities();
        public static string path = "https://storage.cloud.google.com/";

        public static void addMeal(Meal m)
        {
            db.meals.Add(Mapper.convertMealToEntity(m));
            db.SaveChanges();

        }
        public static string UploadFile(string bucketName, string localPath, string objectName = null)
        {
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "C:\\key\\DietDiary-f95b600d05ed.json");
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
        public static List<backend.Models.Meal> getAllMeals()
        {

            List<meal> listMealsEntity = new List<meal>();
            List<Meal> listMeals = new List<Meal>();
            using(var contextdb = new dbDietDairyEntities())
            {
                listMealsEntity = contextdb.meals.ToList<meal>();
                listMeals = listMealsEntity.Select<meal, Meal>(m => Mapper.convertEntityToMeal(m)).ToList<Meal>();//listMealsEntity.Select<meal,object/*api obj*/>(Mapper.convertEntityToMeal);

            }         

            return listMeals;
        }


    }
}