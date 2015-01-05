using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace localforage_photos.web.Models
{
    public class PhotoItem
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Caption { get; set; }
        public byte[] Photo { get; set; }
    }
}