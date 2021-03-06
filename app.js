const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const locationsRoute = require('./api/routes/locations');
const animalsRoute = require('./api/routes/animals');
const userRoute = require('./api/routes/user');


mongoose.connect('mongodb://admin:' + process.env.MONGO_ATLAS_PW + '@rogue-agent-db-shard-00-00-l2g4n.mongodb.net:27017,rogue-agent-db-shard-00-01-l2g4n.mongodb.net:27017,rogue-agent-db-shard-00-02-l2g4n.mongodb.net:27017/test?ssl=true&replicaSet=rogue-agent-db-shard-0&authSource=admin')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allo-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === ' OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
    return res.status(200).json({});
  }
  next();
})

app.use('/api/locations', locationsRoute);
app.use('/api/animals', animalsRoute);
app.use('/api/user', userRoute);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
module.exports = app;
