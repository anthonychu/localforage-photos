using localforage_photos.web.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace localforage_photos.web.Controllers
{
    public class PhotosController : ApiController
    {
        static PhotoItem lastPhoto;

        public IHttpActionResult Post(PhotoItem[] photos)
        {
            lastPhoto = photos[0];
            return Ok();
        }

        public HttpResponseMessage Get()
        {
            var dataStream = new MemoryStream(lastPhoto.Photo);
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new StreamContent(dataStream);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(lastPhoto.Type);

            return response;
        }
    }
}
