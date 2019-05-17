const { lino } = require('./lino');

module.exports = blockchainUsername => {
  return lino.query.getAccountBank(blockchainUsername);
};
