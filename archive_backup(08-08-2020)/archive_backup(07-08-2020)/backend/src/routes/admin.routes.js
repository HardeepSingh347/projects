const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middlewares/auth.middleware');

const AuthCountroller = require('../controllers/auth.controller');
const SeederController = require('../controllers/seeder.controller');
const CompanyController = require('../controllers/company.controller');
const DocTypeController = require('../controllers/doc-type.controller');
const UserController = require('../controllers/user.controller');
const AuthUserController = require('../controllers/auth-user.controller');
const OtpController = require('../controllers/otp.controller');
const DocumentCountroller = require('../controllers/document.controller');

// seeder initial
router.get('/seeder/initial', SeederController.initial_seeder);
router.get('/seeder/initial-folder', SeederController.initial_folders);

// Auth Routes
router.post('/auth/login', AuthCountroller.auth_user_login);
router.post('/auth/forgot-password', AuthUserController.forgotPassword);
router.post('/auth/validate-otp', OtpController.validateOtp);
router.post('/auth/reset-password', AuthUserController.resetPassword);
router.post(
  '/auth/change-password',
  AuthMiddleware,
  AuthUserController.changePassword
);
router.patch(
  '/auth/update-profile',
  AuthMiddleware,
  AuthUserController.updateUser
);

// -----------------------------company---------------------------------------------
router.post('/companies', AuthMiddleware, CompanyController.createCompany);
router.get('/companies', AuthMiddleware, CompanyController.fetchCompanies);
router.get('/companies/:id', AuthMiddleware, CompanyController.fetchCompany);
router.delete(
  '/companies/:id',
  AuthMiddleware,
  CompanyController.deleteCompany
);
router.patch('/companies/:id', AuthMiddleware, CompanyController.updateCompany);

// -----------------------------users---------------------------------------------
router.post('/users', AuthMiddleware, UserController.createUser);
router.get('/users', AuthMiddleware, UserController.fetchUsers);
// router.get('/admins', AuthMiddleware, UserController.fetchAdmins);
router.get('/users/:id', AuthMiddleware, UserController.fetchSingleUser);
router.delete('/users/:id/ban-user', AuthMiddleware, UserController.banUser);
router.delete(
  '/users/:id/suspend-user',
  AuthMiddleware,
  UserController.suspendUser
);
router.patch('/users/:id', AuthMiddleware, UserController.updateUser);

// -----------------------------documents---------------------------------------------
router.post('/documents', AuthMiddleware, DocumentCountroller.createDocument);
router.get('/documents', AuthMiddleware, DocumentCountroller.fetchDocuments);
router.patch(
  '/documents/:id',
  AuthMiddleware,
  DocumentCountroller.updateDocument
);
router.get(
  '/documents/:id/',
  DocumentCountroller.downloadDocument
);
// router.post(
//   '/documents/:id/grant-permission',
//   DocumentCountroller.grantPermission
// );
// router.post(
//   '/documents/:id/remove-permission',
//   DocumentCountroller.removePermission
// );
// router.get('/documents/:id', AuthUser, DocumentCountroller.fetchSingleDocument);

// ----------------------------- Document Types ---------------------------------------------
router.post('/doc-types', AuthMiddleware, DocTypeController.createDocType);
router.get('/doc-types', AuthMiddleware, DocTypeController.fetchDocTypes);
router.get('/doc-types/:id', AuthMiddleware, DocTypeController.fetchDocType);
router.delete(
  '/doc-types/:id',
  AuthMiddleware,
  DocTypeController.deleteDocType
);
router.patch('/doc-types/:id', AuthMiddleware, DocTypeController.updateDocType);
module.exports = router;
