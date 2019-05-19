const sendRequestToDlive = require('./sendRequestToDlive');
module.exports = (streamer, permissionObj) => {
  return sendRequestToDlive(permissionObj, {
    operationName: 'FollowUser',
    query: `mutation FollowUser($streamer: String!) {
        follow(streamer: $streamer) {
          err {
            code
            message
            __typename
          }
          __typename
        }
      }
      `,
    variables: {
      streamer
    }
  });
};
