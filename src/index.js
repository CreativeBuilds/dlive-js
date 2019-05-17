const {
  validateProps,
  getBlockchainUsername,
  rxChat,
  processMessageData,
  getLivestreamPage
} = require('./helpers');
const { BehaviorSubject } = require('rxjs');
const { filter } = require('rxjs/operators');
const Channel = require('./classes/Channel');
const User = require('./classes/User');

const DLive = class {
  constructor(props) {
    validateProps(props);
    this.authKey = props.authKey;
    this.blockchainPrivKey = props.blockchainPrivKey;
    this.permissionObj = { authKey: this.authKey };
    this.sender = props.sender;
    if (this.blockchainPrivKey) {
      this.permissionObj = Object.assign({}, this.permissionObj, {
        blockchainPrivKey: props.blockchainPrivKey
      });
    }
    if (this.sender) {
      this.permissionObj = Object.assign({}, this.permissionObj, {
        sender: props.sender
      });
    }
  }

  /* Return BehaviorSubject
   * When subscribed will get the latest message
   */
  listenToChat(dliveUsername) {
    //   Needs to connect to DLive through a websocket, then on messages from the websocket push them to this.chat, this function returns this.chat
    return getBlockchainUsername(
      Object.assign({}, this.permissionObj, { streamer: dliveUsername }),
      dliveUsername
    ).then(blockchainUsername => {
      let chat = rxChat(blockchainUsername);
      let rxMsgs = new BehaviorSubject();
      chat.subscribe(message => {
        processMessageData(
          message,
          blockchainUsername,
          dliveUsername,
          rxMsgs,
          Object.assign({}, this.permissionObj, {
            streamer: blockchainUsername
          })
        );
      });
      return rxMsgs.pipe(filter(i => !!i));
    });
  }

  /**
   * Returns a Channel object
   */
  getChannel(dliveUsername) {
    // console.log('username', dliveUsername);
    let perms = Object.assign({}, this.permissionObj, {
      authKey: this.authKey,
      streamer: dliveUsername
    });
    return getBlockchainUsername(perms, dliveUsername).then(
      blockchainUsername => {
        return getLivestreamPage(perms, dliveUsername).then(({ data }) => {
          let user = new User(data.userByDisplayName, perms);
          return new Channel(
            { dliveUsername, blockchainUsername, user },
            perms
          );
        });
      }
    );
  }
};

// let dLive = new DLive({ authKey: '' });
// console.log(dLive);

module.exports = DLive;
