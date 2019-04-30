const {
  validateProps,
  getBlockchainUsername,
  rxChat,
  processMessageData
} = require('./helpers');
const { BehaviorSubject } = require('rxjs');
const { filter } = require('rxjs/operators');

const DLive = class {
  constructor(props) {
    validateProps(props);
    this.authKey = props.authKey;
    this.chat = new BehaviorSubject();
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
        console;
        processMessageData(
          message,
          blockchainUsername,
          rxMsgs,
          Object.assign({}, this.permissionObj, {
            streamer: blockchainUsername
          })
        );
      });
      return rxMsgs.pipe(filter(i => !!i));
    });
  }
};

// let dLive = new DLive({ authKey: '' });
// console.log(dLive);

module.exports = DLive;
