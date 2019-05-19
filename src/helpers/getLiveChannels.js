const sendRequestToDlive = require('./sendRequestToDlive');
let streams = [];
module.exports = (index = 0, totalViewers = 0, permissionObj) => {
  if (index === 0) {
    streams = [];
  }
  return sendRequestToDlive(permissionObj, {
    operationName: 'CategoryLivestreamsPage',
    query: `query CategoryLivestreamsPage($id: Int!, $opt: CategoryLivestreamsOption) {
        category(id: $id) {
          id
          backendID
          title
          imgUrl
          watchingCount
          languages {
            ...LanguageFrag
            __typename
          }
          livestreams(opt: $opt) {
            ...VCategoryLivestreamFrag
            __typename
          }
          __typename
        }
      }
      
      fragment VCategoryLivestreamFrag on LivestreamConnection {
        pageInfo {
          endCursor
          hasNextPage
          __typename
        }
        list {
          permlink
          ageRestriction
          ...VLivestreamSnapFrag
          __typename
        }
        __typename
      }
      
      fragment VLivestreamSnapFrag on Livestream {
        id
        creator {
          username
          displayname
          ...VDliveAvatarFrag
          ...VDliveNameFrag
          __typename
        }
        title
        totalReward
        watchingCount
        thumbnailUrl
        lastUpdatedAt
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
      
      fragment LanguageFrag on Language {
        id
        backendID
        language
        __typename
      }`,
    variables: {
      id: '0',
      opt: {
        first: 49,
        after: index.toString(),
        languageID: null,
        showNSFW: true
      }
    }
  }).then(v => {
    if (v.includes('403 Forbidden')) throw new Error('403 timeout');
    let parsed = JSON.parse(v);
    parsed.data.category.livestreams.list.forEach(stream => {
      streams.push(stream);
      totalViewers += stream.watchingCount;
    });
    if (parsed.data.category.livestreams.pageInfo.hasNextPage) {
      return module.exports(
        parsed.data.category.livestreams.pageInfo.endCursor,
        totalViewers,
        permissionObj
      );
    }
    return {
      streamers: parsed.data.category.livestreams.pageInfo.endCursor,
      viewers: totalViewers,
      streams
    };
  });
};
