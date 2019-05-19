const sendRequestToDlive = require('./sendRequestToDlive');
module.exports = (streamer, permissionObj) => {
  return sendRequestToDlive(permissionObj, {
    operationName: 'UnfollowUser',
    query: `mutation UnfollowUser($streamer: String!) {
      unfollow(streamer: $streamer) {
        err {
          code
          message
          __typename
        }
        __typename
      }
    }`,
    variables: {
      streamer
    }
  });
};
