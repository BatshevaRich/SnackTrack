using backend.Models;
using Google.Cloud.Storage.V1;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
namespace dal
{
    public static class Manager
    {
        public static MySqlConnectionStringBuilder csb = new MySqlConnectionStringBuilder
        {
            Server = "35.204.62.53",
            UserID = "root",
            Password = "2019",
            Database = "snacktrack",
            CertificateFile = @"C:\key\client.pfx",
            SslCa = @"C:\key\server-ca.pem",
            SslMode = MySqlSslMode.None,
        };
        public static string path = "https://storage.cloud.google.com/";
        /// <summary>
        /// func to add meal to db. gets an empty meal object
        /// </summary>
        /// <param name="m"></param>
        public static void addMeal(Meal m)
        {
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                meal mm = Mapper.convertMealToEntityAsync(m);
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "INSERT INTO meals(dateTime, path, tags) VALUES(@date, @path, @tag)";
                cmd.Parameters.Add("@date", MySqlDbType.String).Value = mm.dateTime.ToString("dd/MM/yyyy HH:mm:ss");
                cmd.Parameters.Add("@path", MySqlDbType.String).Value = mm.path;
                cmd.Parameters.Add("@tag", MySqlDbType.String).Value = mm.tags;
                cmd.ExecuteNonQuery();
            }
        }
        /// <summary>
        /// func to return list of all meals. called by mealcontroller
        /// </summary>
        /// <returns></returns>
        public async static Task<List<backend.Models.Meal>> getMeals()
        {
            List<meal> listMealsEntity = new List<meal>();
            List<Meal> listMeals = new List<Meal>();
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "SELECT * from meals";
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    CultureInfo provider = CultureInfo.InvariantCulture;
                    meal m = new meal();
                    m.path = reader["path"].ToString();
                    m.tags = reader["tags"].ToString();
                    m.dateTime = DateTime.Parse(reader["dateTime"].ToString());
                    listMealsEntity.Add(m);
                }
            }
            listMeals = listMealsEntity.Select<meal, Meal>(m => Mapper.convertEntityToMeal(m)).ToList<Meal>();//listMealsEntity.Select<meal,object/*api obj*/>(Mapper.convertEntityToMeal);
            return listMeals;
        }

        public static List<Meal> getMealsToDay(DateTime date)
        {
            List<meal> meals = new List<meal>();
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "SELECT * from meals where dateTime = '" + date.ToString() + "'";
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    CultureInfo provider = CultureInfo.InvariantCulture;
                    meal m = new meal();
                    m.path = reader["path"].ToString();
                    m.tags = reader["tags"].ToString();
                    m.dateTime = DateTime.Parse(reader["dateTime"].ToString());
                    meals.Add(m);
                }
            }
            List<Meal> listMealToDay = meals.Select<meal, Meal>(m => Mapper.convertEntityToMeal(m)).ToList<Meal>();
            return listMealToDay;
        }

        public static List<Meal> getMealsByLabel(string label)
        {
            List<meal> meals = new List<meal>();
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "SELECT * from meals where FIND_IN_SET('" + label + "', tags)";
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    CultureInfo provider = CultureInfo.InvariantCulture;
                    meal m = new meal();
                    m.path = reader["path"].ToString();
                    m.tags = reader["tags"].ToString();
                    m.dateTime = DateTime.Parse(reader["dateTime"].ToString());
                    meals.Add(m);
                }
            }
            List<Meal> listMealToDay = meals.Select<meal, Meal>(m => Mapper.convertEntityToMeal(m)).ToList<Meal>();
            return listMealToDay;
        }

        public static List<string> GetLabels()
        {
            List<string> listLabels = new List<string>();

            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "SELECT tags from meals";
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    listLabels.Add(reader[0].ToString());
                }
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
        public static string UploadFileToStorage(string bucketName, string imageString,DateTime DateOfPic, string objectName = null)
        {
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "C:\\key\\DietDiary-f95b600d05ed.json");
            var storage = StorageClient.Create();
            var base64Data = Regex.Match(imageString, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
            var binData = Convert.FromBase64String(base64Data);
            BinaryWriter Writer = null;
            string Name = Path.Combine("C:\\key", "pic.jpg");
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
                objectName = DateOfPic.ToString(@"MM\-dd\-yyyy-h\:mm") + ".jpg";
                var x = storage.UploadObject(bucketName, objectName, null, f);
                Console.WriteLine($"Uploaded {objectName}.");
            }
            return path + bucketName + "/" + objectName;
        }
    }
}