const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');

const app = express();
const pool = mariadb.createPool({
    host: '192.168.5.2',
    user: 'root',
    password: 'mysecretpassword',
    database: 'mi_base_de_datos',
});

// Middleware para analizar el cuerpo de las solicitudes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta GET para obtener todos los productos
app.get('/productos', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM productos');
        conn.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta POST para guardar un producto
app.post('/productos', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        await conn.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                precio DECIMAL(10, 2) NOT NULL
            )
        `);

        const { nombre, precio } = req.body;

        await conn.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
        conn.release();
        res.status(200).json({ message: 'Producto guardado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el producto' });
    }
});

app.delete('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const conn = await pool.getConnection();
        await conn.query('DELETE FROM productos WHERE id = ?', [id]);
        conn.release();

        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

