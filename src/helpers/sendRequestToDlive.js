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
    console.print('DLIVE-JS DEBUG: Making request to dlive...');
    console.print(
      `DLIVE-JS DEBUG: \n---------------- INFO ----------------\nOperationName:${operationName}\nStreamer:${streamer}\nVariables:${JSON.stringify(
        variables
      )}\n---------------- INFO ----------------`
    );
    var body = '';
    var req = https.request(options, res => {
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', function() {
        console.print(`DLIVE-JS DEBUG: Post request passed!`);
        // RES(body);
        try {
          let json = JSON.parse(body);
          if (
            json.errors !== null &&
            (json.errors ? json.errors : []).length > 0
          ) {
            json.errors.forEach(error => {
              if (error.message.includes('Require login')) {
                return rej('authkey failed');
              }
            });
            rej('Dlive errors', json.errors);
          } else {
            RES();
          }
        } catch (err) {
          rej(err);
        }
      });
      res.on('error', function(e) {
        console.print(`DLIVE-JS DEBUG: Post request failed!`);
        RES(
          JSON.stringify({ data: null, errors: ['Request to DLive failed', e] })
        );
      });
    });
    req.write(postData);
    req.end();
  });
};
