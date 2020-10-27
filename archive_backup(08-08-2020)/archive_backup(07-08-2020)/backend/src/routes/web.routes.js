// const express = require('express');
// const router = express.Router();
// const AuthUser = require('../middlewares/user.middleware');

// const UserCountroller = require('../controllers/auth-user.controller');
// const AuthCountroller = require('../controllers/auth.controller');
// const OtpCountroller = require('../controllers/otp.controller');
// const DocumentCountroller = require('../controllers/document.controller');

// // router.post('/signup', UserCountroller.signUp);
// router.post('/login', AuthCountroller.auth_user_login);
// router.post('/forgot-password', UserCountroller.forgotPassword);
// router.post('/validate-otp', OtpCountroller.validateOtp);
// router.post('/reset-password', UserCountroller.resetPassword);

// router.get('/fetch-profile', AuthUser, UserCountroller.fetchProfile);
// router.patch('/change-password', AuthUser, UserCountroller.changePassword);
// router.patch('/update-profile', AuthUser, UserCountroller.updateUser);

// router.post('/documents', AuthUser, DocumentCountroller.createDocument);
// router.get('/documents', AuthUser, DocumentCountroller.fetchDocuments);
// router.get('/documents/:id', AuthUser, DocumentCountroller.fetchSingleDocument);

// module.exports = router;
