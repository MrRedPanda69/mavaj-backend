const Usuario = require("../models/Usuario");
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authUsuario = async (req, res) => {
    // Revisar si hay errores 
    const errores = validationResult(req);
    if(!errores.isEmpty()) res.status(400).json({errores: errores.array()});

    // Extraer email y password
    const { email, password } = req.body;

    try {
        // Revisar que sea un user registrado 
        let usuario = await Usuario.findOne({email});
        if(!usuario) res.status(400).json({msg: 'El usuario no existe'});

        // Revisar Password
        const passwordOk = await bcryptjs.compare(password, usuario.password);
        if(!passwordOk) res.status(400).json({msg: 'Password incorrecto'});

        // Si todo es correcto 
        // Crear JWT 
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar JWT 
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 72000    // 20 hours
        }, (error, token) => {
            if(error) throw error;
            
            // Mensaje de confirmacion 
            res.json({token});
        });
        
    } catch (error) {
        console.log(error);
    }
}