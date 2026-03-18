const app = require('../server.js');

module.exports = app;

// Disable Vercel's default body parser so `multer` can parse the raw multipart/form-data stream!
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
