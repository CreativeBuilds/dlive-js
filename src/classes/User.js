const sendLino = require('../helpers/sendLino');
const getBalance = require('../helpers/getBalance');
const sendRequestToDlive = require('../helpers/sendRequestToDlive');

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

  timeout(streamer) {
    return sendRequestToDlive(
      this.getPermissionObj(),
      {
        operationName: 'UserTimeoutSet',
        query: `mutation UserTimeoutSet($streamer: String!, $username: String!, $duration: Int!) {
          userTimeoutSet(streamer: $streamer, username: $username, duration: $duration) {
            err {
              code
              message
              __typename
            }
            __typename
          }
        }`,
        variables: {
          duration: 5,
          username: this.dliveUsername,
          streamer: streamer
        }
      }
    )
  }
};

module.exports = User;