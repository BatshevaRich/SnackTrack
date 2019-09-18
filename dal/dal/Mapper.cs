using backend.Models;
using System.Linq;

namespace dal
{
    public static class Mapper
    {

        public static meal convertMealToEntityAsync(Meal meal)
        {
            meal res = new meal();
            try
            {
res.path = Manager.UploadFileToStorage("dietdiaryfoodpics", meal.Path,meal.DateOfPic);
            }
            catch (System.Exception e)
            {

                throw e;
            }
            
            res.tags = "";
            foreach (var item in meal.Labels)
            {
                if (res.tags.Equals(""))
                    res.tags += item;
                else res.tags += "," + item;
            }
            res.dateTime = meal.DateOfPic;
            return res;
        }
        public static Meal convertEntityToMeal(meal meal)
        {
            Meal res = new Meal();
            res.DateOfPic = meal.dateTime;
            res.Path = meal.path;
            res.Labels = meal.tags.Split(',').ToList<string>();
            return res;
        }
    }
}