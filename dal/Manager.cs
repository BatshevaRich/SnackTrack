using Google.Cloud.Storage.V1;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
namespace dal
{
    public static class Manager
    {
        public static MySqlConnectionStringBuilder csb = new MySqlConnectionStringBuilder
        {
            Server = "35.204.62.53",
            UserID = "root",
            Password = "2019",
            Database = "snacktrackdb",
            CertificateFile = @"C:\key\client.pfx",
            SslCa = @"C:\key\server-ca.pem",
            SslMode = MySqlSslMode.None,
            ConnectionTimeout = int.MaxValue
        };
        public static string path = "https://storage.cloud.google.com/";
        /// <summary>
        /// func to add meal to db. gets an empty meal object
        /// </summary>
        /// <param name="m"></param>
        public static void addMeal(Meal newMeal)
        {
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "INSERT INTO meals(dateTime, path, tags) VALUES(@date, @path, @tag)";
                cmd.Parameters.Add("@date", MySqlDbType.String).Value = newMeal.DateOfPic.ToString("dd/MM/yyyy HH:mm:ss");
                cmd.Parameters.Add("@path", MySqlDbType.String).Value = UploadFileToStorage("dietdiaryfoodpics", newMeal.Path, newMeal.DateOfPic);
                string tags = "";
                foreach (var item in newMeal.Tags)
                {
                    if (tags.Equals(""))
                    {
                        tags += item;
                    }
                    else
                    {
                        tags += "," + item;
                    }
                }
                cmd.Parameters.Add("@tag", MySqlDbType.String).Value = tags;
                cmd.ExecuteNonQuery();
            }
        }

        public static List<Meal> getUserMeals(string user, string name, string pass)
        {
            List<Meal> listMeals = new List<Meal>();
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                var id = UserExists(name, pass);
                cmd.CommandText = "SELECT * from meals where user = @user";
                cmd.CommandTimeout = 0;
                cmd.Parameters.Add("@user", MySqlDbType.String).Value = name;
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    CultureInfo provider = CultureInfo.InvariantCulture;
                    Meal meal = new Meal
                    {
                        Path = reader["path"].ToString(),
                        Tags = reader["tags"].ToString().Split(',').ToList()
                    };
                    IFormatProvider culture = new CultureInfo("en-US", true);
                    meal.DateOfPic = DateTime.ParseExact(reader["dateTime"].ToString(), "dd/MM/yyyy HH:mm:ss", culture);
                    listMeals.Add(meal);
                }
            }
            return listMeals;
        }

        public static void addMeal(Meal newMeal, string user, string name, string pass)
        {
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "INSERT INTO meals(dateTime, path, tags, user) VALUES(@date, @path, @tag, @user)";
                cmd.Parameters.Add("@date", MySqlDbType.String).Value = newMeal.DateOfPic.ToString("dd/MM/yyyy HH:mm:ss");
                //string x = UploadFileToStorage(name, "dietdiaryfoodpics", newMeal.Path, newMeal.DateOfPic, null);
                try
                {
                    cmd.Parameters.Add("@path", MySqlDbType.String).Value = UploadFileToStorage(user, "dietdiaryfoodpics", newMeal.Path, newMeal.DateOfPic);

                }
                catch (Exception e)
                {

                    throw e;
                }

                cmd.Parameters.Add("@user", MySqlDbType.String).Value = user;
                string tags = "";
                foreach (var item in newMeal.Tags)
                {
                    if (tags.Equals(""))
                    {
                        tags += item;
                    }
                    else
                    {
                        tags += "," + item;
                    }
                }
                cmd.Parameters.Add("@tag", MySqlDbType.String).Value = tags;
                cmd.ExecuteNonQuery();
            }
        }
        /// <summary>
        /// func to return list of all meals. called by mealcontroller
        /// </summary>
        /// <returns></returns>
        public static List<Meal> getMeals()
        {
            IFormatProvider culture = new CultureInfo("en-US", true);
            CultureInfo provider = CultureInfo.InvariantCulture;
            List<Meal> listMeals = new List<Meal>();
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "SELECT * from meals";
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    try
                    {
                        while (reader.Read())
                        {
                            Meal meal = new Meal
                            {
                                Path = reader["path"].ToString(),
                                Tags = reader["tags"].ToString().Split(',').ToList(),
                                DateOfPic = DateTime.ParseExact(reader["dateTime"].ToString(), "dd/MM/yyyy HH:mm:ss", culture)
                            };
                            listMeals.Add(meal);
                        }
                    }
                    catch (Exception e)
                    {

                        return listMeals;
                    }
                    
                }
            }
            return listMeals;
        }


        public static List<Meal> GetMonthMeals(DateTime date)
        {
            List<Meal> meals = new List<Meal>();
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "select * from meals where MID(dateTime, 4, 7) = MID(@dateT, 4,7)";
                cmd.Parameters.Add("@dateT", MySqlDbType.String).Value = date.ToString("dd/MM/yyyy HH: mm:ss");
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    CultureInfo provider = CultureInfo.InvariantCulture;
                    Meal meal = new Meal
                    {
                        Path = reader["path"].ToString(),
                        Tags = reader["tags"].ToString().Split(',').ToList()
                    };
                    var x = reader["dateTime"];
                    IFormatProvider culture = new CultureInfo("en-US", true);
                    meal.DateOfPic = DateTime.ParseExact(reader["dateTime"].ToString(), "dd/MM/yyyy HH:mm:ss", culture);
                    meals.Add(meal);
                }
            }
            return meals;
        }




        public static List<Meal> getMealsToDay(DateTime date)
        {
            List<Meal> meals = new List<Meal>();
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "select * from meals where SUBSTRING_INDEX(dateTime, ' ',1) = SUBSTRING_INDEX(@dateT, ' ',1)";
                cmd.Parameters.Add("@dateT", MySqlDbType.String).Value = date.ToString("dd/MM/yyyy HH: mm:ss");
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    CultureInfo provider = CultureInfo.InvariantCulture;
                    Meal meal = new Meal
                    {
                        Path = reader["path"].ToString(),
                        Tags = reader["tags"].ToString().Split(',').ToList()
                    };
                    IFormatProvider culture = new CultureInfo("en-US", true);
                    meal.DateOfPic = DateTime.ParseExact(reader["dateTime"].ToString(), "dd/MM/yyyy HH:mm:ss", culture);
                    meals.Add(meal);
                }
            }
            return meals;
        }

        public static List<Meal> getMealsByLabel(string label)
        {
            List<Meal> meals = new List<Meal>();
            IFormatProvider culture = new CultureInfo("en-US", true);
            CultureInfo provider = CultureInfo.InvariantCulture;
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "SELECT * from meals where FIND_IN_SET('" + label + "', tags)";
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {                   
                    Meal meal = new Meal
                    {
                        Path = reader["path"].ToString(),
                        Tags = reader["tags"].ToString().Split(',').ToList(),
                        DateOfPic = DateTime.ParseExact(reader["dateTime"].ToString(), "dd/MM/yyyy HH:mm:ss", culture)
                };                   
                    meals.Add(meal);
                }
            }
            return meals;
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
        public static string UploadFileToStorage(string bucketName, string imageString, DateTime DateOfPic, string objectName = null)
        {
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "C:\\key\\DietDiary-f95b600d05ed.json");
            StorageClient storage = null;
            try
            {
                storage = StorageClient.Create();
            }
            catch (Exception e)
            {

                throw e;
            }

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
                objectName = DateOfPic.ToString(@"dd\-MM\-yyyy-h\:mm") + ".jpg";
                var x = storage.UploadObject(bucketName, objectName, null, f);
                Console.WriteLine($"Uploaded {objectName}.");
            }
            return "https://storage.googleapis.com/" + bucketName + "/" + objectName;
        }


        public static string UploadFileToStorage(string user, string bucketName, string imageString, DateTime DateOfPic, string objectName = null)
        {
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "C:\\key\\DietDiary-f95b600d05ed.json");
            StorageClient storage = null;
            try
            {
                storage = StorageClient.Create();
            }
            catch (Exception e)
            {

                throw e;
            }

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
                objectName = Path.Combine(user + "/", DateOfPic.ToString(@"dd\-MM\-yyyy-h\:mm") + ".jpg");
                var x = storage.UploadObject(bucketName, objectName, null, f);
                Console.WriteLine($"Uploaded {objectName}.");
            }
            return "https://storage.googleapis.com/" + bucketName + "/" + objectName;
        }
        public static int UserExists(string name, string pass)
        {
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "select * from users where name = @name";
                cmd.Parameters.Add("@name", MySqlDbType.String).Value = name;
                cmd.Parameters.Add("@pass", MySqlDbType.String).Value = pass;
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    return int.Parse(reader["id"].ToString());

                }
            }
            return 0;
        }

        public static void AddUser(string name, string pass)
        {
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "INSERT INTO users(name) VALUES(@name)";
                cmd.Parameters.Add("@name", MySqlDbType.String).Value = name;
                cmd.ExecuteNonQuery();
            }
        }

        public static void Users(string name, string pass)
        {
            //string email = "";
            int idUser = UserExists(name, pass);
            if (idUser == 0)
            {
                AddUser(name, pass);
            }
        }

    }
}