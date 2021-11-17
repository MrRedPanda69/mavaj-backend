const express = require("express");
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// api/auth 
router.post('/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'Tu password debe ser minimo 6 caracteres').isLength({min: 6})
    ],
    authController.authUsuario
);

module.exports = router;