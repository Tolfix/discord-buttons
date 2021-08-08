const { Message, Client } = require('discord.js');
const MessageComponent = require('./v12/Classes/MessageComponent');
const { MessageComponentTypes } = require('./v12/Constants');

var version = require('discord.js').version.split('');
if (version.includes('(')) version = version.join('').split('(').pop().split('');
version = parseInt(version[0] + version[1]);

module.exports = (client) => {

  if (!(client instanceof Client)) throw new Error('INVALID_CLIENT_PROVIDED: Your discord.js Client is invalid or has not been provided.');

  if (!Message.createButtonCollector || typeof Message.createButtonCollector !== 'function') {
    require('./v12/Classes/TextChannel');
    require('./v12/Classes/DMChannel');
    require('./v12/Classes/NewsChannel');
    require('./v12/Classes/Message');
  }

  client.ws.on('INTERACTION_CREATE', (data) => {
    if (!data.data.component_type) return;

    switch (data.data.component_type) {
      case MessageComponentTypes.BUTTON:
        client.emit('clickButton', new MessageComponent(client, data));
        break;

      case MessageComponentTypes.SELECT_MENU:
        client.emit('clickMenu', new MessageComponent(client, data, true));
        break;

      default:
        client.emit('debug', `Unknown interaction component type, ${data.data.component_type}`);
        break;
    }
  });
};

module.exports.multipleImport = (...clients) => {

  if (!Message.createButtonCollector || typeof Message.createButtonCollector !== 'function') {
    require('./v12/Classes/TextChannel');
    require('./v12/Classes/DMChannel');
    require('./v12/Classes/NewsChannel');
    require('./v12/Classes/Message');
  }

  clients.forEach((client) => {
    if (!(client instanceof Client)) throw new Error('INVALID_CLIENT_PROVIDED: Your discord.js Client is invalid or has not been provided.');

    client.ws.on('INTERACTION_CREATE', (data) => {
      if (!data.data.component_type) return;

      switch (data.data.component_type) {
        case MessageComponentTypes.BUTTON:
          client.emit('clickButton', new MessageComponent(client, data));
          break;

        case MessageComponentTypes.SELECT_MENU:
          client.emit('clickMenu', new MessageComponent(client, data, true));
          break;
        default:
          client.emit('debug', `Unknown interaction component type, ${data.data.component_type}`);
          break;
      }
    });
  });
};

module.exports.MessageButton = require(`./v12/Classes/MessageButton`);
module.exports.MessageMenu = require(`./v12/Classes/MessageMenu`);
module.exports.MessageMenuOption = require(`./v12/Classes/MessageMenuOption`);
module.exports.MessageActionRow = require('./v12/Classes/MessageActionRow');
module.exports.MessageComponent = require('./v12/Classes/MessageComponent');
module.exports.Message = Message;
module.exports.ButtonCollector = require(`./v12/Classes/ButtonCollector`);
module.exports.MenuCollector = require(`./v12/Classes/MenuCollector`);
module.exports.APIMessage = require('./v12/Classes/APIMessage').APIMessage;
module.exports.sendAPICallback = require('./v12/Classes/APIMessage').sendAPICallback;
// module.exports.DMChannel = DMChannel;
// module.exports.NewsChannel = NewsChannel;
// module.exports.TextChannel = TextChannel;
module.exports.WebhookClient = require('./v12/Classes/WebhookClient');
module.exports.Util = require('./v12/Util');
module.exports.Constants = require('./v12/Constants');
module.exports.InteractionReply = require(`./v12/Classes/managers/InteractionReply`);
