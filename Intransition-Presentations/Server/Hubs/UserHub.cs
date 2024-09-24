using Instend.Server.Database.Abstraction;
using Microsoft.AspNetCore.SignalR;

namespace Exider_Version_2._0._0.Server.Hubs
{
    public class UserHub : Hub
    {
        private readonly IPresentationsRepository _presentationsRepository;

        public UserHub(IPresentationsRepository presentationsRepository)
        {
            _presentationsRepository = presentationsRepository; 
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        //public async Task<object> Join(string username, string presentation)
        //{


        //    //return await _presentationsRepository.GetModel();
        //}
    }
}