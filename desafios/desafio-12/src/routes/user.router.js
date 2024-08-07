const express = require('express');
const router = express.Router();
const UserManager = require('../controllers/UserManager.js');
const userManager = new UserManager();


router.post('/register', userManager.register)
router.post('/reset-password', userManager.requestPasswordReset)
router.post('/change-password',userManager.resetPassword)
router.put("/premium/:uid", userManager.changePremiumRol) 

module.exports = router;