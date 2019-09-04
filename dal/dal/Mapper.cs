using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using backend.Models;

namespace dal
{
    public static class Mapper
    {

        public static meal convertMealToEntity(Meal meal)
        {
            meal res = new meal();
            res.path = Manager.UploadFileToStorage("image_food_to_dietdairy", meal.Path);
            foreach (var item in meal.Labels)
            {
                res.tags += "," + item;
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