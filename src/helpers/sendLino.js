const { lino } = require('./lino');
const getBlockchainUsername = require('./getBlockchainUsername');

// TODO add options toggle setting

module.exports = (
  receiverBlockchainUsername,
  amountInLemons,
  memo = 'github.com/CreativeBuilds/dlive-js',
  permissionsObj
) => {
  if (!memo || memo === null) memo = 'github.com/CreativeBuilds/dlive-js';
  if (!permissionsObj.blockchainPrivKey) {
    throw new Error(
      "No blockchainPrivKey set on initilization, can't send lino!"
    );
  }
  console.log('GOING TO GET INFO ON BANK', permissionsObj.streamer);
  let sender = permissionsObj.sender || permissionsObj.streamer;
  return lino.query.getAccountBank(sender).then(v => {
    console.log(
      `Transfering: ${amountInLemons} from ${sender} to ${receiverBlockchainUsername}`
    );
    if (v.saving.amount < Number(amountInLemons))
      return new Error('Error, not enough funds!');
    let receiver = receiverBlockchainUsername;
    return lino.query.getSeqNumber(sender).then(seq => {
      console.log(sender, receiver, amountInLemons, memo, seq);
      return lino.broadcast.transfer(
        sender,
        receiver,
        Number(amountInLemons),
        memo,
        permissionsObj.blockchainPrivKey,
        seq
      );
    });
  });
};
