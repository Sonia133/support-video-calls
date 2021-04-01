const functions = require("firebase-functions");
const app = require('express')();

var cors = require('cors');
app.use(cors());

const {
    login, requestAccount, validateToken, signup, changePassword, forgotPassword
} = require('./handlers/auth');
const { getAuthenticatedUser, uploadImage } = require('./handlers/authenticatedUser');
const { updateSchedule, getEmployee, getEmployees, getFeedback, setAvailability } = require('./handlers/employee');
const { deleteEmployee, getCeos } = require('./handlers/ceo');
const { addAdmin, deleteCeo } = require('./handlers/admin');
const { 
    getCalls, getCallsPerEmployee, getCallsPerCompany, addCallDetails, findEmployee, addFeedback
} = require('./handlers/call');
const { videoToken } = require('./handlers/video');

const FBRequestAuth = require('./util/functions/authValidations/FBRequestAuth');
const FBAdminAuth = require('./util/functions/authValidations/FBAdminAuth');
const FBCeoAuth = require('./util/functions/authValidations/FBCeoAuth');
const FBEmployeeAuth = require('./util/functions/authValidations/FBEmployeeAuth');
const FBUserAuth = require('./util/functions/authValidations/FBUserAuth');

// initialize admin
// addAdmin();

// auth routes
app.post('/requestAccount', FBRequestAuth, requestAccount);
app.get('/invite/validation/:token', validateToken);
app.post('/signup/:token', signup);
app.post('/login', login);
app.post('/forgotPassword', forgotPassword);
app.post('/changePassword', FBUserAuth, changePassword);

// employee routes
app.post('/employee/updateSchedule', FBEmployeeAuth, updateSchedule);
app.post('/employee/changeAvailability', FBEmployeeAuth, setAvailability);

// ceo routes
app.delete('/employee/:employeeEmail', FBCeoAuth, deleteEmployee);

// admin routes
app.delete('/ceo/:ceoEmail', FBAdminAuth, deleteCeo);
app.get('/ceos', FBAdminAuth, getCeos);

// user auth -> common functionality
app.post('/updateImage', FBUserAuth, uploadImage);
app.get('/user', FBUserAuth, getAuthenticatedUser);
app.get('/employees/:companyName', FBUserAuth, getEmployees);
app.get('/employee/:companyName/:employeeEmail', FBUserAuth, getEmployee);
app.get('/employee/feedback/:companyName/:employeeEmail', FBUserAuth, getFeedback);

// call routes
app.get('/calls', FBAdminAuth, getCalls);
app.get('/calls/company/:companyName', FBUserAuth, getCallsPerCompany);
app.get('/calls/employee/:companyName/:employeeEmail', FBUserAuth, getCallsPerEmployee);
app.post('/call/start/:companyName', findEmployee);
app.post('/call/end', addCallDetails);
app.post('/call/feedback', addFeedback);

// initiate video calls routes
app.post('/video/token', videoToken);

exports.api = functions.region('europe-west1').https.onRequest(app);
