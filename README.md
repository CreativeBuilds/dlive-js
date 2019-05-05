**Welcome To DLive-JS. This is a community built node module to help you make awesome applications that run on DLive's undocumented API**

### Getting Started

1.  install the module using npm like so, `npm i dlive-js --save`
2.  After installing you can require dlive and make a new class object like so.

```javascript
const DLive = require('dlive-js');
let dlive = new DLive({
  authKey: 'INSERT YOUR DLIVE AUTH KEY HERE',
  blockchainPrivKey: 'THIS IS YOUR LINO BLOCKCHAIN WALLET KEY'
});
// NOTE YOU NEED TO SUPPLY AN AUTHKEY BUT NOT A BLOCKCHAINPRIVKEY, YOU ONLY NEED TO SUPPLY THAT IF YOU WANT TO USE THE SEND LINO FUNCTION.

/* Next connect to the channel to receive new messages! */

dlive.listenToChat('creativebuilds').then(messages => {
  // messages is an rxjs BehaviourSubject which you need to subscribe to, and it will run the function every time a new message is found!
  messages.subscribe(message => {
    console.log('GOT A NEW MESSAGE', message);
    // You can reply to a message like so
    message.reply('Thanks for that message son!');
  });
});
```

3. If you have any questions about documentation/how it works, contact me on discord CreativeBuilds#0001 **DOCUMENTATION IS NOW RELEASED AND A WORK IN PROGRESS YOU CAN VIEW IT [HERE](https://github.com/CreativeBuilds/dlive-js/wiki)**
