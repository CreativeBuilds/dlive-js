const sendRequestToDlive = require('./sendRequestToDlive');
module.exports = permissionObj => {
  return sendRequestToDlive(permissionObj, {
    operationName: 'MeGlobal',
    query: `query MeGlobal {
        me {
          ...MeGlobalFrag
          __typename
        }
      }
      
      fragment MeGlobalFrag on User {
        id
        username
        ...VDliveAvatarFrag
        displayname
        partnerStatus
        role
        private {
          accessToken
          insecure
          email
          phone
          nextDisplayNameChangeTime
          language
          showSubSettingTab
          registrationType
          __typename
        }
        ...SettingsSubscribeFrag
        __typename
      }
      
      fragment VDliveAvatarFrag on User {
        avatar
        __typename
      }
      
      fragment SettingsSubscribeFrag on User {
        id
        subSetting {
          badgeColor
          badgeText
          textColor
          benefits
          __typename
        }
        __typename
      }
      `,
    variables: {}
  }).then(v => {
    if (v.includes('403 Forbidden')) throw new Error('403 timeout');
    let parsed = JSON.parse(v);
    return parsed;
  });
};
