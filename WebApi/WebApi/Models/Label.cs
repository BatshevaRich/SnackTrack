using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class Label
    {
        public string Name { get; set; }
        public decimal? Probability { get; set; }
    }
}