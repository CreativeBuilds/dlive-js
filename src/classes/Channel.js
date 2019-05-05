const getLivestreamPage = require('../helpers/getLivestreamPage');
const { BehaviorSubject } = require('rxjs');
const { first, filter } = require('rxjs/operators');
const getUptime = require('../helpers/getUptime');
const Channel = class {
  constructor({ dliveUsername, blockchainUsername, user }, permissionObj) {
    console;
    let _permissionObj = permissionObj;
    this.getPermissionObj = () => {
      return _permissionObj;
    };
    this.dliveUsername = dliveUsername;
    this.blockchainUsername = blockchainUsername;
    this.user = user;
    this.livestream = null;
    this.rxLivestream = new BehaviorSubject({});
    this.updateLivestream();
    this.updateInterval = setInterval(() => {
      this.updateLivestream();
    }, 10000);
  }

  /**
   * Gets the latest data from dlive for  the livestream object
   * (if the channel is live otherwise it sets this.livestream to null)
   */
  updateLivestream() {
    return getLivestreamPage(this.getPermissionObj(), this.dliveUsername).then(
      ({ data }) => {
        this.livestream = data.userByDisplayName.livestream;
        this.rxLivestream.next(data.userByDisplayName.livestream);
        return data.userByDisplayName.livestream;
      }
    );
  }

  /**
   * Forces a refresh on the livestream object
   * Returns null if the user is offline or a json object if the user is online
   */
  getIsLive() {
    return getLivestreamPage(this.getPermissionObj(), this.dliveUsername).then(
      ({ data }) => {
        this.livestream = data.userByDisplayName.livestream;
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
            if (typeof x === 'object' && Object.keys(x).length === 0)
              return false;
            return true;
          }),
          first()
        )
        .subscribe(livestream => {
          if (!livestream) res(0);
          getUptime(this.user.blockchainUsername).then(seconds => {
            res(seconds);
          });
        });
    });
  }
};
module.exports = Channel;
