const User = require('./User');
const Channel = require('./Channel');
const sendMessage = require('../helpers/sendMessage');

var env = process.env.NODE_ENV || 'production';
let print = console.log;
if (env === 'production') {
  print = () => {};
}

const Message = class {
  constructor(
    message,
    streamerBlockchainUsername,
    streamerDliveUsername,
    permissionObj
  ) {
    let _permissionObj = permissionObj;
    this.content = message.content ? message.content : '';
    this.type = message.type;
    this.createdAt = message.createdAt ? message.createdAt : Date.now();
    this.id = message.id;
    this.role = message.role;
    this.roomRole = message.roomRole;
    if (!message.sender) {
      print('NO MESSAGE SENDER', message);
    }
    this.sender = message.sender
      ? new User(message.sender, permissionObj)
      : null;
    this.streamerBlockchainUsername = streamerBlockchainUsername;
    this.streamerDliveUsername = streamerDliveUsername || null;
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
