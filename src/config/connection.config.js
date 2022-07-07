require("dotenv").config();
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
  credential: applicationDefault(),
  storageBucket: "gs://project3-52ef5.appspot.com"
});
const db = getFirestore();

module.exports = { db };
