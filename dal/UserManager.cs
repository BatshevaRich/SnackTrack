using Google.Cloud.Storage.V1;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
namespace dal
{
    public static class UserManager
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
        };
        public static string path = "https://storage.cloud.google.com/";

        public async static Task<List<Meal>> getUserMeals(string user, string name, string pass)
        {
            List<Meal> listMeals = new List<Meal>();
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                var id = UserExists(name, pass);
                cmd.CommandText = "SELECT * from meals where user = @user";
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
        public static List<Meal> getMealsToDay(string year, string month, string day, string name, string pass)
        {
            CultureInfo provider = CultureInfo.InvariantCulture;
            IFormatProvider culture = new CultureInfo("es-ES", false);
            var dt = new DateTime(int.Parse(year), int.Parse(month), int.Parse(day));
            var dateTime = Convert.ToDateTime(dt);
            //.ToString("dd/MM/yyyy HH:mm:ss");
            //DateTime dd = DateTime.ParseExact(date.Substring(0, date.IndexOf('G')), "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            List<Meal> meals = new List<Meal>();
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "select * from meals where user= @user and SUBSTRING_INDEX(dateTime, ' ',1) = SUBSTRING_INDEX(@dateT, ' ',1)";
                cmd.Parameters.Add("@user", MySqlDbType.String).Value = name;
                cmd.Parameters.Add("@dateT", MySqlDbType.String).Value = dateTime.ToString("dd/MM/yyyy HH: mm:ss");
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Meal meal = new Meal
                    {
                        Path = reader["path"].ToString(),
                        Tags = reader["tags"].ToString().Split(',').ToList()
                    };
                    meal.DateOfPic = DateTime.ParseExact(reader["dateTime"].ToString(), "dd/MM/yyyy HH:mm:ss", culture);
                    meals.Add(meal);
                }
            }
            return meals;
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
                    cmd.Parameters.Add("@path", MySqlDbType.String).Value = UploadFileToStorage(name, "dietdiaryfoodpics", newMeal.Path, newMeal.DateOfPic);

                }
                catch (Exception e)
                {

                    throw e;
                }

                cmd.Parameters.Add("@user", MySqlDbType.String).Value = name;
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
        public static List<Meal> getMealsByLabel(string label, string name, string pass)
        {
            List<Meal> meals = new List<Meal>();
            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "SELECT * from meals where user = @user and FIND_IN_SET('" + label + "', tags)";
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
                    meals.Add(meal);
                }
            }
            return meals;
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
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    return int.Parse(reader["id"].ToString());

                }
            }
            return 0;
        }
        public static List<string> GetLabels(string user, string name, string pass)
        {
            List<string> listLabels = new List<string>();

            using (var connection = new MySqlConnection(csb.ConnectionString))
            {
                connection.Open();
                MySqlCommand cmd = connection.CreateCommand();
                cmd.CommandText = "SELECT tags from meals where user = @name";
                cmd.Parameters.Add("@name", MySqlDbType.String).Value = name;
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
    }
}
