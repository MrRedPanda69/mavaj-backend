const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult  } = require('express-validator');

// Crea una nueva tarea 
exports.crearTarea = async (req, res) => {
    // Revisar si hay errores 
    const errores = validationResult(req);
    if(!errores.isEmpty()) res.status(400).json({errores: errores.array()});

    try {
        // extraer el proyecto y comprobar si existe 
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) res.status(404).json({msg: 'Proyecto no encontrado'});

        // verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // crear tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).json('Error en crearTarea');
    }
}

// obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        // extraer el proyecto y comprobar si existe 
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) res.status(404).json({msg: 'Proyecto no encontrado'});

        // verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Obtener tareas por proyecto 
        const tareas = await Tarea.find({proyecto});
        res.json({tareas})
        
    } catch (error) {
        console.log(error);
        res.status(500).json('Error en obtenerTareas');
    }
}

exports.actualizarTarea = async (req, res) => {
    try {
        // extraer el proyecto y comprobar si existe 
        const { proyecto, nombre, estado } = req.body;

        // Si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) return res.status(404).json({msg: 'La tarea no existe'});

        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Crear obj con nueva info 
        const nuevaTarea = {};
        if(nombre) nuevaTarea.nombre = nombre;
        if(estado) nuevaTarea.estado = estado;

        // Guardar tarea   
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, { new: true});

        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        res.status(500).json('Error en actualizarTarea');
    }
}

// Elimina tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // extraer el proyecto y comprobar si existe 
        const { proyecto } = req.body;

        // Si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) return res.status(404).json({msg: 'La tarea no existe'});

        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }
        
        // Elminar tarea 
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea eliminada'});

        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        res.status(500).json('Error en actualizarTarea');
    }
}