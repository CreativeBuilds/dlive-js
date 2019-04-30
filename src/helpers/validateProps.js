// Returns an error or null
const validateProps = props => {
  if (!props.authKey) throw new Error('Config is missing authKey');
};

module.exports = validateProps;
