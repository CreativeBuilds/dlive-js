const request = require('request');

module.exports = blockchainUsername => {
  return new Promise((res, rej) => {
    request(
      `https://live.prd.dlive.tv/hls/live/${blockchainUsername}.m3u8`,
      function(err, response, body) {
        if (err) throw err;
        let arr = body.split('\n');
        let link = arr[arr.length - 2];
        if (!!link) {
          request(link, function(err, response, body) {
            if (err) throw err;
            let arr = body.split('\n');
            let text = arr[arr.length - 2];
            if (!!text) {
              let number = Number(text.replace('.ts', ''));
              if (isNaN(number)) return rej('Error has occured');
              let seconds = number * 2;
              return res(seconds);
            }
          });
        }
      }
    );
  });
};
