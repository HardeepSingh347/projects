const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
require('./db/mongodb.js');

let server;
// const webRoutes = require('./routes/web.routes');
const adminRoutes = require('./routes/admin.routes');

const port = process.env.PORT;
const server_mode = process.env.ENVIRONMENT_PRODUCTION;

if (server_mode === 'true') {
  server = https.Server(
    {
      key: fs.readFileSync('/home/crowd/public_html/crowd.key'),
      cert: fs.readFileSync('/home/crowd/public_html/crowd.crt'),
    },
    app
  );
} else {
  server = http.Server(app);
}

// Define paths for express config
const publicDirPath = path.join(__dirname, '../public');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicDirPath));

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-custom-header, Authorization, Authorization-identity, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, OPTIONS, PATCH, DELETE, PUT'
  );
  next();
});

// app.get('/', (req, res) => {
//   res.send('hello world');
// });

// app.use('/api/web', webRoutes);
app.use('/api/admin', adminRoutes);

// 404 Error
app.get('*', (req, res) => {
  return res.status(400).send({
    status: false,
    status_code: 400,
    message: 'URL Not found.',
  });
});

if (server_mode == 'true') {
  server.listen(port, () => {
    console.log('Server is up on port ' + port);
    console.log('Running production server.');
  });
} else {
  server.listen(port, () => {
    console.log('Server is up on port ' + port);
    console.log('Running stagging server.');
  });
}
