const getLivestreamPage = require('../helpers/getLivestreamPage');
const { BehaviorSubject } = require('rxjs');
const { first, filter, tap } = require('rxjs/operators');
const getUptime = require('../helpers/getUptime');
const sendMessage = require('../helpers/sendMessage');
const follow = require('../helpers/follow');
const unfollow = require('../helpers/unfollow');
const getLivestreamChatroomInfo = require('../helpers/getLivestreamChatroomInfo');

const Channel = class {
  constructor({ dliveUsername, blockchainUsername, user }, permissionObj) {
    let _permissionObj = permissionObj;
    this.getPermissionObj = () => {
      return _permissionObj;
    };
    this.dliveUsername = dliveUsername;
    this.blockchainUsername = blockchainUsername;
    this.user = user;
    this.rxLivestream = new BehaviorSubject({}).pipe(
      tap(() => {
        if (!this.updateInterval) {
          /**
           * Fetches new info on livestream if a user subscribes to the BehaviorSubject
           */
          setInterval(() => {
            this.updateLivestream();
          }, 10000);
        }
      })
    );
    this.updateLivestream();
    this.updateInterval = null;
  }

  /**
   * Gets the latest data from dlive for  the livestream object
   */
  updateLivestream() {
    return getLivestreamPage(this.getPermissionObj(), this.dliveUsername).then(
      ({ data }) => {
        this.rxLivestream.next(data.userByDisplayName.livestream);
        return data.userByDisplayName.livestream;
      }
    );
  }

  /**
   * @description sends a message to a channel
   * @param {string} msg
   * @returns {promise} sent message
   */
  sendMessage(msg) {
    return sendMessage(msg, this.blockchainUsername, this.getPermissionObj());
  }

  /**
   * @description follow the channel
   */
  follow() {
    return follow(this.blockchainUsername, this.getPermissionObj());
  }

  /**
   * @description unfollow the channel
   */
  unfollow() {
    return unfollow(this.blockchainUsername, this.getPermissionObj());
  }

  /**
   * @description get info about your account relative to the current channel
   * @return {Promise} returns a raw data object from dlive.
   */
  getChatroomInfo() {
    return getLivestreamChatroomInfo(
      this.getPermissionObj(),
      this.dliveUsername
    );
  }

  /**
   * Forces a refresh on the livestream object
   * Returns null if the user is offline or a json object if the user is online
   */
  getIsLive() {
    return getLivestreamPage(this.getPermissionObj(), this.dliveUsername).then(
      ({ data }) => {
        this.rxLivestream.next(data.userByDisplayName.livestream);
        return !!data.userByDisplayName.livestream;
      }
    );
  }

  /**
   * Returns a promise of a number with the current amount of viewers, or 0
   * if the stream is offline
   */
  getViewers() {
    return this.updateLivestream().then(livestream => {
      return !!livestream ? livestream.watchingCount : 0;
    });
  }

  /**
   * Gets rough uptime in seconds
   * NOTE: your frame interval HAS to be set to 2 seconds otherwise this will be off!
   */
  getUptime() {
    return new Promise(res => {
      this.rxLivestream
        .pipe(
          filter(x => {
            if (typeof x === 'object' && x !== null) {
              if (Object.keys(x).length === 0) return false;
            }

            return true;
          }),
          first()
        )
        .subscribe(livestream => {
          if (!livestream) res(null);
          getUptime(this.user.blockchainUsername).then(seconds => {
            res(seconds);
          });
        });
    });
  }
};
module.exports = Channel;
