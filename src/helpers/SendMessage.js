const sendRequestToDlive = require('./sendRequestToDlive');

// Now queues messages and loops by authKey to enable multiple Dlive objects/authKeys
// To send near-instantaneously. (Before, two different Dlive objects used the same
// sendMessage module with the same msgs object and loop. So one would be held up
// by the loop that was started by the other Dlive object.)

let msgs = {};
let loop = {};

const checkMessages = authKey => {
  if (msgs[authKey].length <= 0) {
    clearInterval(loop[authKey]);
    loop[authKey] = null;
    console.log('LOOP IS CLEARED.');
    return;
  }
  let msg = msgs[authKey][0];
  msgs[authKey] = msgs[authKey].splice(1);
  sendRequestToDlive(msg.permissionObj, {
    operationName: 'SendStreamChatMessage',
    // So this is a GraphQL query...
    query: `mutation SendStreamChatMessage($input: SendStreamchatMessageInput!) {
                sendStreamchatMessage(input: $input) {
                  err {
                    code
                    __typename
                  }
                  message {
                    type
                    ... on ChatText {
                      id
                      content
                      ...VStreamChatSenderInfoFrag
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
              }

              fragment VStreamChatSenderInfoFrag on SenderInfo {
                subscribing
                role
                roomRole
                sender {
                  id
                  username
                  displayname
                  avatar
                  partnerStatus
                  __typename
                }
                __typename
              }
              `,
    variables: {
      input: {
        streamer: msg.streamer,
        message: msg.message,
        roomRole: 'Moderator',
        subscribing: true
      }
    }
  })
    .then(i => {
      if (msg.cb) {
        msg.cb(i);
      }
    })
    .catch(err => {
      msg.cb(null);
      throw err;
    });
};

const sendMessage = (message, streamerBlockchainUsername, permissionObj) => {
  if (!msgs[permissionObj.authKey]) msgs[permissionObj.authKey] = [];
  return new Promise((resolve, reject) => {
    let { splitAt } = permissionObj;
    let newMsgs = [];
    let charsLength = message.length;
    for (let i = 0; i < charsLength; i += splitAt) {
      newMsgs.push(message.substring(i, i + splitAt));
    }
    newMsgs.forEach(message => {
      let msg = {
        message,
        streamer: streamerBlockchainUsername,
        permissionObj,
        cb: body => {
          resolve(body);
        }
      };
      msgs[permissionObj.authKey].push(msg);
    });

    if (!loop[permissionObj.authKey]) {
      checkMessages(permissionObj.authKey);
      loop[permissionObj.authKey] = setInterval(() => {
        checkMessages(permissionObj.authKey);
      }, permissionObj.timerInterval);
    }
  });
};

module.exports = sendMessage;
