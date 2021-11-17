const Usuario = require("../models/Usuario");
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    // Revisar si hay errores 
    const errores = validationResult(req);
    if(!errores.isEmpty()) res.status(400).json({errores: errores.array()});

    // extraer email y password 
    const { email, password } = req.body;

    try {
        // revisar email unico 
        let usuario = await Usuario.findOne({email});
        if(usuario) res.status(400).json({msg: 'El usuario ya existe'});

        // crea nuevo usuario 
        usuario = new Usuario(req.body);

        // hash password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // guardar usuario 
        await usuario.save();

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
        res.status(400).json({msg: 'Error en crear usuario'});
    }
}