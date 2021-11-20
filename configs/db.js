
const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
};

//let url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;


module.exports = {
  'secret': '',
  'database': 'mongodb://127.0.0.1:27017/learning',
  'options': options
};
