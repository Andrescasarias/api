// Importar librerías
const express = require('express');
const connection = require('./db');

// Crear app con Express
const app = express();

// Middleware para parsear JSON y datos por URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Puerto del servidor
const PORT = 5000;

// Rutas de prueba
app.get('/api/prueba', (req, res) => {
    res.send('Estoy respondiendo por la API');
});

app.get('/api/prueba2', (req, res) => {
    res.status(200).json({
        message: 'API funciona bien',
        port: PORT,
        status: 'exitoso'
    });
});

//  guardar en la base de datos
app.post('/api/guardar', (req, res) => {
    const { cedula, nombre, edad, profesion } = req.body;
    const query = 'INSERT INTO persona (cedula, nombre, edad, profesion) VALUES ($1, $2, $3, $4)';

    connection.query(query, [cedula, nombre, edad, profesion], (error, result) => {
        if (error) {
            res.status(500).json({
                message: 'ERROR CREANDO EL USUARIO',
                error
            });
        } else {
            res.status(201).json({ cedula, nombre, edad, profesion });
        }
    });
});

// Ruta para obtener todos los registros
app.get('/api/obtener', (req, res) => {
    const query = 'SELECT * FROM persona';

    connection.query(query, (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Error al recuperar los datos",
                details: error.message
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Datos de la tabla",
                data: result.rows 
            });
        }
    });
});

//eliminar por cédula
app.delete('/api/eliminar/:cedula', (req, res) => {
    const { cedula } = req.params;
    const query = 'DELETE FROM persona WHERE cedula = $1';

    connection.query(query, [cedula], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Error al eliminar el registro",
                details: error.message
            });
        } else if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No existe el registro con cédula ${cedula}`,
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Dato eliminado de la tabla"
            });
        }
    });
});

//actualizar registro 
app.put('/api/actualizar/:cedula', (req, res) => {
    const { cedula } = req.params;
    const { nombre, edad, profesion } = req.body;

    const query = 'UPDATE persona SET nombre = $1, edad = $2, profesion = $3 WHERE cedula = $4';

    connection.query(query, [nombre, edad, profesion, cedula], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el registro',
                details: error.message
            });
        } else if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No se encontró ningún registro con la cédula ${cedula}`
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Registro actualizado correctamente',
                updated: {
                    cedula,
                    nombre,
                    edad,
                    profesion
                }
            });
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

