// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// type Data = {
//   name: string;
// };

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>,
// ) {
//   res.status(200).json({ name: "Fernando Mendes" });
// }

import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const products = await prisma.product.findMany();
        return res.status(200).json(products);

      case 'POST':
        const newProduct = await prisma.product.create({
          data: req.body,
        });
        return res.status(201).json(newProduct);

        case 'PUT':
          const { id, ...data } = req.body;
          const updatedProduct = await prisma.product.update({
            where: { id: id },
            data,
          });
          return res.status(200).json(updatedProduct);
  
        case 'DELETE':
          const { productId } = req.body;
          await prisma.product.update({
            where: { id: productId },
            data: { isActive: false },
          });
          return res.status(200).json({ message: 'The product was deleted' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
