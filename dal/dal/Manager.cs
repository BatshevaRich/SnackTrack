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
        public static string path = "https://storage.cloud.google.com/";

        public static void addMeal(Meal m)
        {
            using (var contextdb = new dbDietDairyEntities())
            {
                contextdb.meals.Add(Mapper.convertMealToEntity(m));
                contextdb.SaveChanges();
            }
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

        public static List<Meal> getMealsToDay(DateTime date)
        {
            List<meal> meals = new List<meal>();
            using (var contextdb = new dbDietDairyEntities())
            {
                meals = contextdb.meals.Where(m => m.dateTime.Equals(date)).ToList();
            }
            List<Meal> listMealToDay = meals.Select<meal, Meal>(m => Mapper.convertEntityToMeal(m)).ToList<Meal>();
            return listMealToDay;
        }‏

        public static List<string> GetLabels()
        {
            List<string> listLabels = new List<string>();
            using (var contextdb = new dbDietDairyEntities())
            {
               listLabels = contextdb.meals.Select(m => m.tags).ToList();
            }
                SortedSet<string> labelsSet = new SortedSet<string>();
                listLabels.ForEach(ls => ls.Split(',').ToList().ForEach(l => labelsSet.Add(l)));
                return labelsSet.ToList();
        }
        




          public static string UploadFile(string bucketName, string localPath, string objectName = null)
        {
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "C:\\key\\DietDiary-f95b600d05ed.json");
           // var env = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS");

            var storage = StorageClient.Create();
            using (var f = File.OpenRead(localPath))
            {
                objectName = objectName ?? Path.GetFileName(localPath);
                var x = storage.UploadObject(bucketName, objectName, null, f);
                Console.WriteLine($"Uploaded {objectName}.");
            }
            return path + bucketName + "/" + objectName;

        }
    }
}