const { Client } = require('pg');

module.exports = async (req, res) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        if (req.method === 'GET') {
            const result = await client.query('SELECT * FROM parcelas ORDER BY numero ASC');
            return res.status(200).json(result.rows);
        }

        if (req.method === 'PUT') {
            const { id, pago, dataPagamento, valorPago } = JSON.parse(req.body);
            const query = `
                UPDATE parcelas 
                SET pago = $1, data_pagamento = $2, valor_pago = $3
                WHERE id = $4 RETURNING *
            `;
            const result = await client.query(query, [pago, dataPagamento, valorPago, id]);
            return res.status(200).json(result.rows[0]);
        }

        return res.status(405).send('Method Not Allowed');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    } finally {
        await client.end();
    }
};
