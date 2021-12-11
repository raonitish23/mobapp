
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

let url = `mongodb+srv://admin:admin123@cluster0.h0mb8.mongodb.net/mobapp?retryWrites=true&w=majority`;
// let url = 'mongodb://127.0.0.1:27017/mobapp'

module.exports = {
  'secret': '',
  'database': url,
  'options': options
};
