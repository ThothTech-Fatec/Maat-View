import express, { Request, Response } from "express";
import  pool from "../config/database.js"; 
import { RowDataPacket } from "mysql2/promise"; 

const app = express();

app.use(express.json());

export const BuscarTodosUsers = async (req: Request, res: Response) => {
    const { cpf } = req.params;
    try {
        console.log(cpf)
        // Especificando que o resultado é um array de RowDataPacket
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT id, nome FROM Users WHERE cpf = ?",
            [cpf]
        );
        // Agora `rows` é tratado como um array, então `length` está disponível
        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const lideradoId = rows[0].id;
        const nomeLiderado = rows[0].nome
        return res.status(200).json({ id: lideradoId, nomeLiderado });
    } catch (error) {
        console.error("Erro ao buscar ID pelo CPF e lider_id:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};
