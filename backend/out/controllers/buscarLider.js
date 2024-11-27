import express from "express";
import pool from "../config/database.js";
const app = express();
app.use(express.json());
export const BuscarUserLider = async (req, res) => {
    const { cpf } = req.params;
    try {
        console.log(cpf);
        // Especificando que o resultado é um array de RowDataPacket
        const [rows] = await pool.query("SELECT lider_id FROM Users WHERE cpf = ?", [cpf]);
        // Agora `rows` é tratado como um array, então `length` está disponível
        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        const liderId = rows[0].lider_id;
        return res.status(200).json({ liderId });
    }
    catch (error) {
        console.error("Erro ao buscar ID pelo CPF e lider_id:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};
