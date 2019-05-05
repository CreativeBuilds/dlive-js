const sendRequestToDlive = require('./sendRequestToDlive');

module.exports = (permissionObj, displayname) => {
  return sendRequestToDlive(permissionObj, {
    operationName: 'LivestreamPage',
    query: `query LivestreamPage($displayname: String!, $add: Boolean!, $isLoggedIn: Boolean!) {
        userByDisplayName(displayname: $displayname) {
          id
          ...VDliveAvatarFrag
          ...VDliveNameFrag
          ...VFollowFrag
          ...VSubscriptionFrag
          banStatus
          deactivated
          about
          avatar
          myRoomRole @include(if: $isLoggedIn)
          isMe @include(if: $isLoggedIn)
          isSubscribing @include(if: $isLoggedIn)
          livestream {
            id
            permlink
            watchTime(add: $add)
            ...LivestreamInfoFrag
            ...VVideoPlayerFrag
            __typename
          }
          hostingLivestream {
            id
            creator {
              ...VDliveAvatarFrag
              displayname
              username
              __typename
            }
            ...VVideoPlayerFrag
            __typename
          }
          ...LivestreamProfileFrag
          __typename
        }
      }
      
      fragment LivestreamInfoFrag on Livestream {
        category {
          title
          imgUrl
          id
          backendID
          __typename
        }
        title
        watchingCount
        totalReward
        ...VDonationGiftFrag
        ...VPostInfoShareFrag
        __typename
      }
      
      fragment VDonationGiftFrag on Post {
        permlink
        creator {
          username
          __typename
        }
        __typename
      }
      
      fragment VPostInfoShareFrag on Post {
        permlink
        title
        content
        category {
          id
          backendID
          title
          __typename
        }
        __typename
      }
      
      fragment VDliveAvatarFrag on User {
        avatar
        __typename
      }
      
      fragment VDliveNameFrag on User {
        displayname
        partnerStatus
        __typename
      }
      
      fragment LivestreamProfileFrag on User {
        isMe @include(if: $isLoggedIn)
        canSubscribe
        private @include(if: $isLoggedIn) {
          subscribers {
            totalCount
            __typename
          }
          __typename
        }
        videos {
          totalCount
          __typename
        }
        pastBroadcasts {
          totalCount
          __typename
        }
        followers {
          totalCount
          __typename
        }
        following {
          totalCount
          __typename
        }
        ...ProfileAboutFrag
        __typename
      }
      
      fragment ProfileAboutFrag on User {
        id
        about
        __typename
      }
      
      fragment VVideoPlayerFrag on Livestream {
        disableAlert
        category {
          id
          title
          __typename
        }
        language {
          language
          __typename
        }
        __typename
      }
      
      fragment VFollowFrag on User {
        id
        username
        displayname
        isFollowing @include(if: $isLoggedIn)
        isMe @include(if: $isLoggedIn)
        followers {
          totalCount
          __typename
        }
        __typename
      }
      
      fragment VSubscriptionFrag on User {
        id
        username
        displayname
        isSubscribing @include(if: $isLoggedIn)
        canSubscribe
        isMe @include(if: $isLoggedIn)
        __typename
      }
      
        `,
    variables: {
      displayname,
      isLoggedIn: true,
      add: false
    }
  }).then(livestream => {
    return JSON.parse(livestream);
  });
};
