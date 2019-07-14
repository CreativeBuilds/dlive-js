const Message = require('./Message');

const Subscription = class extends Message {
  constructor(msg, streamerBlockchainUsername, permissionObj) {
    super(msg, streamerBlockchainUsername, permissionObj);
    this.month = msg.month;
    this.content = `${this.sender.dliveUsername} just subscribed!`;
    this.timestamp = Date.now();
  }
};

module.exports = Subscription;
