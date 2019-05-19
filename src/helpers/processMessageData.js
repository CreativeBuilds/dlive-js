const Message = require('../classes/Message');
const Gift = require('../classes/Gift');

module.exports = (
  Data,
  streamerBlockchainUsername,
  streamerDliveUsername,
  rxMsgs,
  permissionObj
) => {
  let data = JSON.parse(Data);

  // This is the 'keep alive' request from DLive, and can be ignored
  if (data.type === 'ka') return null;
  if (data.type === 'data') {
    if (data.payload.data.treasureChestMessageReceived) {
      return rxMsgs.next(data.payload.data.treasureChestMessageReceived);
    }
    data.payload.data.streamMessageReceived.forEach(msg => {
      // console.log('new msg');
      if (!msg || msg === null || typeof msg !== 'object') return;
      if (msg.type === 'Gift') {
        rxMsgs.next(
          new Gift(
            msg,
            streamerBlockchainUsername,
            streamerDliveUsername,
            permissionObj
          )
        );
      } else if (msg.type === 'Message' || msg.type === 'Follow') {
        rxMsgs.next(
          new Message(
            msg,
            streamerBlockchainUsername,
            streamerDliveUsername,
            permissionObj
          )
        );
      } else if (
        msg.type === 'Delete' ||
        msg.type === 'Ban' ||
        msg.type === 'Offline' ||
        msg.type === 'Live' ||
        msg.type === 'Mod' ||
        msg.type === 'Subscription' ||
        msg.type === 'Host' ||
        msg.type === 'Timeout'
      ) {
        // TODO add classes for all these types
      } else {
        // console.log(msg.type, msg);
      }
    });
  }
};
