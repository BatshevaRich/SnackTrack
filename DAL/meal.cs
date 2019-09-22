using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dal
{
    public class Meal
    {
        public DateTime DateOfPic { get; set; }
        public string Path { get; set; }
        public List<string> Tags { get; set; }
    }
}

