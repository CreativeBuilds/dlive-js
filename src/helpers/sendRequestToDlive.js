const https = require('https');

// Takes permission object and request object
module.exports = (
  { authKey, streamer = 'dlivejsnpmmodule' },
  { operationName, query, variables, extensions }
) => {
  return new Promise((RES, rej) => {
    const postData = JSON.stringify({
      extensions,
      operationName,
      query,
      variables
    });

    const options = {
      hostname: 'graphigo.prd.dlive.tv',
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        accept: '*/*',
        authorization: authKey,
        'content-type': 'application/json',
        fingerprint: '',
        gacid: 'undefined',
        Origin: 'https://dlive.tv',
        Referer: 'https://dlive.tv/' + streamer,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
      }
    };
    var body = '';
    var req = https.request(options, res => {
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', function() {
        RES(body);
      });
      res.on('error', function(e) {
        rej(e);
      });
    });
    req.write(postData);
    req.end();
  });
};
