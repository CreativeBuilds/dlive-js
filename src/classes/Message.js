const User = require('./User');
const Channel = require('./Channel');
const sendMessage = require('../helpers/sendMessage');
const sendRequestToDlive = require('../helpers/sendRequestToDlive');

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
    this.id = message.id;
    this.content = message.content ? message.content : '';

    this.type = message.type;
    this.createdAt = message.createdAt ? message.createdAt : Date.now();
    this.streamerBlockchainUsername = streamerBlockchainUsername;
    this.streamerDliveUsername = streamerDliveUsername || null;
    if (!message.sender) {
      print('NO MESSAGE SENDER', message);
    }
    this.sender = message.sender
      ? new User(message.sender, permissionObj)
      : null;
    this.roomRole = message.roomRole;
    this.role = message.role;

    if (message.type === 'Follow') {
      this.content = `${this.sender.dliveUsername} has just followed!`;
    }
    this.isEmote =
      ((this.content || '').match(/[:]/gi) || []).length === 2
        ? this.content.search(/emote/gi) > -1
          ? true
          : false
        : false;

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

  delete() {
    return sendRequestToDlive(this.getPermissionObj(), {
      operationName: 'DeleteChat',
      query: `mutation DeleteChat($streamer: String!, $id: String!) {
          chatDelete(streamer: $streamer, id: $id) {
            err {
              code
              message
              __typename
            }
            __typename
          }
        }`,
      variables: {
        id: this.id,
        streamer: this.streamerBlockchainUsername
      }
    });
  }
};

module.exports = Message;
