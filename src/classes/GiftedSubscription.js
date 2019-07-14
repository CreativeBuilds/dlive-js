const Message = require('./Message');

const Subscription = class extends Message {
  constructor(msg, streamerBlockchainUsername, permissionObj) {
    super(msg, streamerBlockchainUsername, permissionObj);
    this.receiver = msg.receiver;
    this.count = msg.count;
    this.content = `${this.sender.dliveUsername} just sent ${
      this.receiver
    } a one-month subscription!`;
    this.timestamp = Date.now();
  }
};

module.exports = Subscription;
