const GiftedSubscription = require('./GiftedSubscription');

const GiftedSubscriptionReceived = class extends GiftedSubscription {
  constructor(msg, streamerBlockchainUsername, permissionObj) {
    super(msg, streamerBlockchainUsername, permissionObj);
    this.receiver = msg.sender.dliveUsername;
    this.gifter = msg.gifter;
    this.content = `${
      this.sender.dliveUsername
    } just recieved a one-month subscription from ${this.gifter}!`;
    this.timestamp = Date.now();
  }
};

module.exports = GiftedSubscriptionReceived;
