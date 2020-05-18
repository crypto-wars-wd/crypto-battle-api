const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { routes } = require('routes');
const swaggerDocument = require('./swagger');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));

app.use('/', routes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Last middleware which send data from "res.result.json" to client
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(res.result.status || 200).json(res.result.json);
});
// middleware for handle error for each request
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500).json({ message: err.message });
});
module.exports = app;
