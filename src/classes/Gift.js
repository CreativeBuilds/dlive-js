const Message = require('./Message');

const Gift = class extends Message {
  constructor(
    msg,
    streamerBlockchainUsername,
    streamerDliveUsername,
    permissionObj
  ) {
    super(msg, streamerBlockchainUsername, permissionObj);
    this.gift = msg.gift;
    this.amount = msg.amount;
    this.content = `${this.sender.dliveUsername} just donated ${
      this.amount
    } ${this.gift.toLowerCase()}${this.amount > 1 ? 's' : ''}!`;
    const inLino = (gift, amount) => {
      let multiplier = 9.01e2;
      switch (gift) {
        case 'ICE_CREAM':
          multiplier = 9.01e3;
          break;
        case 'DIAMOND':
          multiplier = 9.01e4;
          break;
        case 'NINJAGHINI':
          multiplier = 9.01e5;
          break;
        case 'NINJET':
          multiplier = 9.01e6;
          break;
        default:
          multiplier = 9.01e2;
          break;
      }
      return amount * multiplier;
    };
    this.inLino = inLino(this.gift, this.amount) / 0.901 / 1000;
    this.profit = inLino(this.gift, this.amount) / 1000;
  }
};

module.exports = Gift;
