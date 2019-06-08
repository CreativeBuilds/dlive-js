const sendRequestToDlive = require('./sendRequestToDlive');
module.exports = (permsObj, { streamer, username }) => {
  return sendRequestToDlive(permsObj, {
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash:
          '574e9a8db47ff719844359964d6108320e4d35f0378d7f983651d87b315d4008'
      }
    },
    operationName: 'UnbanStreamChatUser',
    variables: {
      streamer,
      username
    }
  });
};
