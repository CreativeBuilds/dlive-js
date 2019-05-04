const User = require('./User');
const sendMessage = require('../helpers/sendMessage');

// TODO impliment a 'reply' feature which will send a message back to that channel that the message came from

const Message = class {
  constructor(message, streamerBlockchainUsername, permissionObj) {
    let _permissionObj = permissionObj;
    this.content = message.content;
    this.type = message.type;
    this.createdAt = message.createdAt;
    this.id = message.id;
    this.type = message.type;
    this.role = message.role;
    this.roomRole = message.roomRole;
    this.sender = new User(message.sender, permissionObj);
    this.streamerBlockchainUsername = streamerBlockchainUsername;
    this.getPermissionObj = () => {
      return _permissionObj;
    };
  }

  reply(replyMsg) {
    sendMessage(
      replyMsg,
      this.streamerBlockchainUsername,
      this.getPermissionObj()
    );
  }
};

module.exports = Message;
