let config = {};

config.port = process.env.PORT || 3000;
config.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://kts:kts@localhost/kts'
};
config.cryptoKey = 'milutth3c4t';

export default config;
