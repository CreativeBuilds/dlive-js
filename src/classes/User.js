const sendLino = require('../helpers/sendLino');

const User = class {
  constructor(
    { username, displayname, id, __typename, avatar, partnerStatus },
    permissionObj
  ) {
    if (__typename !== 'StreamchatUser')
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
};
module.exports = User;
