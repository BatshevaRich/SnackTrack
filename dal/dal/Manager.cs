using backend.Models;
using Google.Cloud.Storage.V1;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
namespace dal
{
    public static class Manager
    {
        public static string path = "https://storage.cloud.google.com/";
        /// <summary>
        /// func to add meal to db. gets an empty meal object
        /// </summary>
        /// <param name="m"></param>
        public static void addMeal(Meal m)
        {
            using (var contextdb = new dbDietDairyEntities())
            {
                contextdb.meals.Add(Mapper.convertMealToEntityAsync(m));
                try
                {
                contextdb.SaveChanges();
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }
        /// <summary>
        /// func to return list of all meals. called by mealcontroller
        /// </summary>
        /// <returns></returns>
        public static List<backend.Models.Meal> getAllMeals()
        {
            List<meal> listMealsEntity = new List<meal>();
            List<Meal> listMeals = new List<Meal>();
            using (var contextdb = new dbDietDairyEntities())
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

                var query = from m in contextdb.meals
                            where m.dateTime.Day == date.Day
                            && m.dateTime.Month == date.Month
                            && m.dateTime.Year == date.Year
                            select m;
                meals = query.ToList();
            }
            List<Meal> listMealToDay = meals.Select<meal, Meal>(m => Mapper.convertEntityToMeal(m)).ToList<Meal>();
            return listMealToDay;
        }
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
        /// <summary>
        /// func to upload file to google cloud storage.
        /// </summary>
        /// <param name="bucketName">the google cloud bucket name</param>
        /// <param name="imageString">the base64 image string</param>
        /// <param name="objectName"></param>
        /// <returns></returns>
        public static string UploadFileToStorage(string bucketName, string imageString, string objectName = null)
        {
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "C:\\key\\DietDiary-f95b600d05ed.json");
            var storage = StorageClient.Create();

            var base64Data = Regex.Match(imageString, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
            var binData = Convert.FromBase64String(base64Data);

            BinaryWriter Writer = null;
            string Name = "C:\\Users\\owner\\Desktop\\pic.jpg";
            try
            {
                // Create a new stream to write to the file
                Writer = new BinaryWriter(File.OpenWrite(Name));

                // Writer raw data                
                Writer.Write(binData);
                Writer.Flush();
                Writer.Close();
            }
            catch (Exception e)
            {
                throw e;
            }
            using (var f = File.OpenRead(Name))
            {
                objectName = DateTime.Now.ToString(@"MM\-dd\-yyyy-h\:mm");
                var x = storage.UploadObject(bucketName, objectName, null, f);
                Console.WriteLine($"Uploaded {objectName}.");
            }
            return path + bucketName + "/" + objectName;
        }
    }
}