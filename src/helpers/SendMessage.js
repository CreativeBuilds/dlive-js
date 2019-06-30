const sendRequestToDlive = require('./sendRequestToDlive');

let msgs = [];
let loop;

// Check the msgs array every 2.1 seconds to send the next message (2.1 seconds to avoid debouncing of dlive);
const checkMessages = () => {
  if (msgs.length <= 0) {
    clearInterval(loop);
    loop = null;
    return;
  }
  let msg = msgs[0];
  msgs = msgs.splice(1);
  sendRequestToDlive(msg.permissionObj, {
    operationName: 'SendStreamChatMessage',
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
  return new Promise((response, reject) => {
    let newMsgs = message.match(/.{1,140}/g);
    newMsgs.forEach(message => {
      msgs.push({
        message,
        streamer: streamerBlockchainUsername,
        permissionObj,
        cb: body => {
          response(body);
        }
      });
    });
    if (!loop) {
      checkMessages();
      loop = setInterval(() => {
        checkMessages();
      }, 2100);
    }
  });
};

module.exports = sendMessage;
