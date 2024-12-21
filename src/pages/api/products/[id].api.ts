import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query; // Pega o ID da rota dinâmica

  try {
    switch (method) {
      case "GET": {
        console.log("ID do produto => ", id)
        // Valida se o ID foi fornecido
        if (!id || typeof id !== "string") {
          console.log(id)
          return res.status(400).json({ error: "O campo 'id' é obrigatório e deve ser uma string." });
        }

        const product = await prisma.product.findUnique({
          where: { id: id },
        });

        if (!product) {
          return res.status(404).json({ error: "Produto não encontrado." });
        }

        return res.status(200).json(product);
      }

      case "PUT": {
        // Valida se o ID foi fornecido
        if (!id || typeof id !== "string") {
          return res.status(400).json({ error: "O campo 'id' é obrigatório e deve ser uma string." });
        }

        const updatedProduct = await prisma.product.update({
          where: { id: id },
          data: req.body,
        });

        return res.status(200).json(updatedProduct);
      }

      case "DELETE": {
        // Valida se o ID foi fornecido
        if (!id || typeof id !== "string") {
          return res.status(400).json({ error: "O campo 'id' é obrigatório e deve ser uma string." });
        }

        await prisma.product.update({
          where: { id: id },
          data: { isActive: false },
        });

        return res.status(200).json({ message: "Produto excluído com sucesso." });
      }

      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Ocorreu um erro desconhecido." });
  }
}
