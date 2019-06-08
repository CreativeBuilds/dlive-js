const sendRequestToDlive = require('./sendRequestToDlive');
module.exports = (permsObj, { streamer, username }) => {
  return sendRequestToDlive(permsObj, {
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash:
          '4eaeb20cba25dddc95df6f2acf8018b09a4a699cde468d1e8075d99bb00bacc4'
      }
    },
    operationName: 'BanStreamChatUser',
    variables: {
      streamer,
      username
    }
  });
};
