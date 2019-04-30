const getLivestreamChatroomInfo = require('./getLivestreamChatroomInfo');

module.exports = (permissionObj, dliveUsername) => {
  return getLivestreamChatroomInfo(permissionObj, dliveUsername).then(user => {
    try {
      return JSON.parse(user).data.userByDisplayName.username;
    } catch (err) {
      return '';
    }
  });
};
