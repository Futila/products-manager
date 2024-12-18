import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";


//Some metrics based on registered products.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Query the database data
    const totalProducts = await prisma.product.count();
    const inStock = await prisma.product.count({
      where: { inStock: true },
    });
    const inactive = await prisma.product.count({
      where: { isActive: false },
    });
    const averageCost = await prisma.product.aggregate({
      _avg: { cost_price: true },
    });
    const averageSale = await prisma.product.aggregate({
      _avg: { sale_price: true },
    });

   // Response with metrics
    res.status(200).json({
      totalProducts,
      inStock,
      inactive,
      averageCost: averageCost._avg?.cost_price || 0,
      averageSale: averageSale._avg?.sale_price || 0,
    });
  } catch (error) {
    console.error("Erro ao calcular métricas:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}
