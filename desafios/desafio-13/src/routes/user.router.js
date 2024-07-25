const express = require('express');
const router = express.Router();
const UserManager = require('../controllers/UserManager.js');
const userManager = new UserManager();


router.post('/register', userManager.register)
router.post('/requestPasswordReset', userManager.requestPasswordReset)
router.post('/reset-password',userManager.resetPassword)
// router.put("/premium/:uid", ) //CONTINUAR

module.exports = router;