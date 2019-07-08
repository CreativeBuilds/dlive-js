const {
  validateProps,
  getBlockchainUsername,
  rxChat,
  processMessageData,
  getLivestreamPage,
  getLiveChannels: GetLiveChannels
} = require('./helpers');
const { BehaviorSubject } = require('rxjs');
const { filter } = require('rxjs/operators');
const Channel = require('./classes/Channel');
const User = require('./classes/User');
const sendRequestToDlive = require('./helpers/sendRequestToDlive');
const getBalance = require('./helpers/getBalance');
const meGlobal = require('./helpers/meGlobal');
const sendMessage = require('./helpers/SendMessage');
console.print = console.log;

const DLive = class {
  constructor(props) {
    validateProps(props);
    if (props.debug === false) {
      console.print = e => {};
    } else {
      console.print(
        'DLIVE-JS DEBUG: Debug messages enabled, if you wish to disable them please add the flag {debug:false} in the DLive-JS Options on class creation.'
      );
    }
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
  listenToChat(dliveUsername, returnWs = false) {
    //   Needs to connect to DLive through a websocket, then on messages from the websocket push them to this.chat, this function returns this.chat
    return getBlockchainUsername(
      Object.assign({}, this.permissionObj, { streamer: dliveUsername }),
      dliveUsername
    ).then(blockchainUsername => {
      let chat = rxChat(blockchainUsername, returnWs);
      if (returnWs) {
        ws = chat.ws;
        chat = chat.messages;
      }
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
      if (returnWs) return { rxMsgs: rxMsgs.pipe(filter(i => !!i)), ws };
      return rxMsgs.pipe(filter(i => !!i));
    });
  }

  /**
   *
   * @param {string} msg Message to send to the channel
   * @param {string} dliveUsername The username of the channel you want to send to
   */
  sendMessage(msg, dliveUsername) {
    let perms = Object.assign({}, this.permissionObj, {
      authKey: this.authKey,
      streamer: dliveUsername
    });
    return getBlockchainUsername(perms, dliveUsername).then(
      blockchainUsername => {
        return sendMessage(msg, blockchainUsername, perms);
      }
    );
  }

  /**
   * @description get all live channels on Dlive (does not provide channel objects, just raw data from dlive)
   * @returns {Promise} with Obj
   */
  getLiveChannels() {
    return GetLiveChannels(0, 0, this.permissionObj);
  }

  getBalance() {
    return getBalance(this.blockchainUsername);
  }

  /**
   * @description get a channel object by providing a dliveUsername
   * @param {string} dliveUsername
   * @returns {Promise} of a Channel object
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

  getSelf() {
    return meGlobal({ authKey: this.permissionObj.authKey });
  }

  /**
   * @description custom call to dlive
   * @param {permissionObj} {authKey:''}
   * @param {object} {query, variables, operationName}
   */
  customCall(permissionObj, requestObj) {
    return sendRequestToDlive(permissionObj, requestObj);
  }
};

// let dLive = new DLive({ authKey: '' });
// console.log(dLive);

module.exports = DLive;
