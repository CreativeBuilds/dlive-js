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
    data.payload.data.streamMessageReceived.forEach(msg => {
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
      } else {
        // console.log('EXTRA MSG READ ALL ABOUT IT', msg);
      }
    });
  }
};
