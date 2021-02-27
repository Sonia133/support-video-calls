const functions = require("firebase-functions");
const app = require('express')();

var cors = require('cors');
app.use(cors());

const {
    login, requestAccount, validateToken, signup, uploadImage, changePassword, forgotPassword
} = require('./handlers/auth');
const { updateSchedule } = require('./handlers/employee');
const { deleteEmployee } = require('./handlers/ceo');
const { addAdmin, deleteCeo } = require('./handlers/admin');

const FBRequestAuth = require('./util/functions/authValidations/FBRequestAuth');
const FBAdminAuth = require('./util/functions/authValidations/FBAdminAuth');
const FBCeoAuth = require('./util/functions/authValidations/FBCeoAuth');
const FBEmployeeAuth = require('./util/functions/authValidations/FBEmployeeAuth');

// initialize admin
addAdmin();

// auth routes
app.post('/requestAccount', FBRequestAuth, requestAccount);
app.post('/invite/validation/:token', validateToken);
app.post('/signup/:token', signup);
app.post('/login', login);
app.post('/forgotPassword', forgotPassword);
app.post('/changePassword', changePassword);

// employee routes
app.post('/employee/updateSchedule', FBEmployeeAuth, updateSchedule);
app.post('/employee/updateImage', FBEmployeeAuth, uploadImage);

// ceo routes
app.delete('/employee/:employeeEmail', FBCeoAuth, deleteEmployee);
app.post('/ceo/updateImage', FBCeoAuth, uploadImage);

// admin routes
app.delete('/ceo/:ceoEmail', FBAdminAuth, deleteCeo);
app.post('/admin/updateImage', FBAdminAuth, uploadImage);

exports.api = functions.region('europe-west1').https.onRequest(app);
