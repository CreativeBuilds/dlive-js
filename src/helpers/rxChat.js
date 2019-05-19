const makeWebSocketObservable = require('rxjs-websockets').default;
const { switchMap, retryWhen, delay } = require('rxjs/operators');
const { QueueingSubject } = require('queueing-subject');
const WebSocket = require('ws');

// Takes a blockchainUsername from the linoBlockchain NOT a dlive username
const makeSocket = blockchainUsername => {
  const input$ = new QueueingSubject();

  const socket$ = makeWebSocketObservable('wss://graphigostream.prd.dlive.tv', {
    makeWebSocket: (uri, protocols) => {
      let ws = new WebSocket(uri, protocols);
      ws.on('open', function() {
        ws.send(
          JSON.stringify({
            type: 'connection_init',
            payload: {}
          })
        );
        ws.send(
          JSON.stringify({
            id: '1',
            type: 'start',
            payload: {
              variables: {
                streamer: blockchainUsername
              },
              extensions: {},
              operationName: 'StreamMessageSubscription',
              query:
                'subscription StreamMessageSubscription($streamer: String!) {\n  streamMessageReceived(streamer: $streamer) {\n    type\n    ... on ChatGift {\n      id\n      gift\n      amount\n      recentCount\n      expireDuration\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatHost {\n      id\n      viewer\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatSubscription {\n      id\n      month\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatChangeMode {\n      mode\n    }\n    ... on ChatText {\n      id\n      content\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatFollow {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatDelete {\n      ids\n    }\n    ... on ChatBan {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatModerator {\n      id\n      ...VStreamChatSenderInfoFrag\n      add\n    }\n    ... on ChatEmoteAdd {\n      id\n      ...VStreamChatSenderInfoFrag\n      emote\n    }\n  }\n}\n\nfragment VStreamChatSenderInfoFrag on SenderInfo {\n  subscribing\n  role\n  roomRole\n  sender {\n    id\n    username\n    displayname\n    avatar\n    partnerStatus\n  }\n}\n'
            }
          })
        );
        ws.send(
          JSON.stringify({
            id: '2',
            type: 'start',
            payload: {
              variables: {
                streamer: blockchainUsername
              },
              extensions: {},
              operationName: 'TreasureChestMessageReceived',
              query: `subscription TreasureChestMessageReceived($streamer: String!) {
                treasureChestMessageReceived(streamer: $streamer) {
                  type
                  ... on TreasureChestGiveawayEnded {
                    type
                    __typename
                  }
                  ... on TreasureChestValueExpired {
                    type
                    expireAt
                    value
                    __typename
                  }
                  ... on TreasureChestGiveawayStarted {
                    type
                    endTime
                    pricePool
                    durationInSeconds
                    __typename
                  }
                  ... on TreasureChestReadyToCollect {
                    type
                    __typename
                  }
                  ... on TreasureChestValueUpdated {
                    type
                    value
                    __typename
                  }
                  __typename
                }
              }
              `
            }
          })
        );
      });
      return ws;
    },
    protocols: ['graphql-ws']
  });

  const messages$ = socket$.pipe(
    // the observable produces a value once the websocket has been opened
    switchMap(getResponses => {
      return getResponses(input$);
    }),
    retryWhen(errors => errors.pipe(delay(1000)))
  );
  return messages$;
};

module.exports = makeSocket;
