using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace backend.Models
{
    public class Meal
    {
        public DateTime DateOfPic { get; set; }
        public string Path { get; set; }
        public List<string> Labels { get; set; }
    }
}