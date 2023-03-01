const ImageKit = require("imagekit");

require("dotenv").config();
const imagekit = new ImageKit({
  publicKey : "public_7S6aT5JsIfPXZxFWNMPXrRDNvT0=",
  privateKey : "private_bhtCtdBNAzTzrJqTanvnGUh0+Aw=",
  urlEndpoint : "https://ik.imagekit.io/b4x27zdza"
});


module.exports = imagekit;