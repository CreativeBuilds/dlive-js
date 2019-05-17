const sendLino = require('../helpers/sendLino');
const getBalance = require('../helpers/getBalance');

const User = class {
  constructor(
    { username, displayname, id, __typename, avatar, partnerStatus },
    permissionObj
  ) {
    if (__typename !== 'StreamchatUser' && __typename !== 'User')
      throw new Error('typename from message does not equal StreamchatUser');
    let _permissionObj = permissionObj;
    this.id = id;
    this.blockchainUsername = username;
    this.dliveUsername = displayname;
    this.avatar = avatar;
    this.partnerStatus = partnerStatus;
    this.getPermissionObj = () => {
      return _permissionObj;
    };
  }

  sendLino(amount, memo) {
    return sendLino(
      this.blockchainUsername,
      amount,
      (memo = null),
      this.getPermissionObj()
    );
  }

  getLinoBalance() {
    return getBalance(this.blockchainUsername).then(obj => {
      return Math.floor(obj.saving.amount);
    });
  }
};
module.exports = User;
