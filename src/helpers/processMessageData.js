const Message = require('../classes/Message');
const Gift = require('../classes/Gift');

module.exports = (Data, streamerBlockchainUsername, rxMsgs, permissionObj) => {
  let data = JSON.parse(Data);

  // This is the 'keep alive' request from DLive, and can be ignored
  if (data.type === 'ka') return null;
  if (data.type === 'data') {
    data.payload.data.streamMessageReceived.forEach(msg => {
      if (msg.type === 'Gift') {
        rxMsgs.next(new Gift(msg, streamerBlockchainUsername, permissionObj));
      } else if (msg.type === 'Message' || msg.type === 'Follow') {
        rxMsgs.next(
          new Message(msg, streamerBlockchainUsername, permissionObj)
        );
      } else {
        // console.log('EXTRA MSG READ ALL ABOUT IT', msg);
      }
    });
  }
};
