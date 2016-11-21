"use strict";

let firebase = require("firebase/app"),
    fb = require("./fb-getter"),
    fbData = fb();

require("firebase/auth");

let config = {
  apiKey: fbData.apiKey,
  authDomain: fbData.authDomain
};

firebase.initializeApp(config);

module.exports = firebase;