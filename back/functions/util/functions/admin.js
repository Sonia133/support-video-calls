const admin = require('firebase-admin');
const config = require('../constants/config');
const firebase = require('firebase');

admin.initializeApp();
const db = admin.firestore();

firebase.initializeApp(config);
const socket = firebase.database();

module.exports = { admin, db, firebase, socket };