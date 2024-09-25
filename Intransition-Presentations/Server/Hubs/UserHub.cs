using Instend.Server.Database.Abstraction;
using Itrantion.Server.Database.Abstraction;
using Itrantion.Server.Services;
using Microsoft.AspNetCore.SignalR;

namespace Itransition.Server.Hubs
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
            await Disconnect();
        }

        public async Task Disconnect()
        {
            var result = await _presentationsRepository.DeleteConnection(Context.ConnectionId);

            if (result.username != null && result.username != null)
            {
                await Clients.Group(result.presentationId.ToString() ?? "").SendAsync("DisconnectUser", result.username);
            }
        }

        public async Task Join(string username, Guid presentationId)
        {
            var presentation = await _presentationsRepository.GetModel(presentationId);

            if (presentation.Presentation == null)
                return;

            var result = await _presentationsRepository.RegisterNewConnection
            (
                username,
                Context.ConnectionId, 
                presentationId
            );

            if (result == null)
                return;

            presentation.Presentation.connectedUsers.Add(result);

            await Groups.AddToGroupAsync(Context.ConnectionId, presentationId.ToString());
            await Clients.Group(presentationId.ToString()).SendAsync("JoinedPresentation", SerializationHelper.SerializeWithCamelCase(presentation));
        }
    }
}