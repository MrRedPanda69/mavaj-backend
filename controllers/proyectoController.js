const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {
    // Revisar si hay errores 
    const errores = validationResult(req);
    if(!errores.isEmpty()) res.status(400).json({errores: errores.array()});

    try {
        // Crear proyecto 
        const proyecto = new Proyecto(req.body);

        // Guardar creador via JWT 
        proyecto.creador = req.usuario.id;

        // Guardar proyecto
        proyecto.save();
        res.json(proyecto);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en crearProyecto');
    }
}

// Obtiene todos los proyectos del user actual 
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id});
        res.json(proyectos);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en obtenerProyectos')
    }
}

// Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
    // Revisar si hay errores 
    const errores = validationResult(req);
    if(!errores.isEmpty()) res.status(400).json({errores: errores.array()});

    // extraer info del proyecto 
    const { nombre } = req.body; 
    const nuevoProyecto = {};

    if(nombre) nuevoProyecto.nombre = nombre;

    try {
        // revisar id 
        let proyecto = await Proyecto.findById(req.params.id);

        // si el proyecto existe
        if(!proyecto) res.status(404).json({msg: 'Proyecto no encontrado'});

        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // actualizar
        proyecto = await Proyecto.findOneAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true});

        res.json({proyecto});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en actualizarProyecto');
    }
}

// Eliminar proyecto por id 
exports.eliminarProyecto = async (req, res) => {
    try {
        // revisar id 
        let proyecto = await Proyecto.findById(req.params.id);

        // si el proyecto existe
        if(!proyecto) res.status(404).json({msg: 'Proyecto no encontrado'});

        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Eliminar Proyecto 
        await Proyecto.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Proyecto Eliminado'});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en eliminarProyecto');
    }
}