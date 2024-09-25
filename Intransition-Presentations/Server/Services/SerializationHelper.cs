using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;

namespace Itrantion.Server.Services
{
    public static class SerializationHelper
    {
        public static string SerializeWithCamelCase(object obj)
        {
            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            return JsonConvert.SerializeObject(obj, serializerSettings);
        }
    }
}