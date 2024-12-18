// import Image from "next/image";
// import localFont from "next/font/local";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export default function Home() {
//   return (
//     <h1 className="text-9xl underline">Hello world</h1>
//   );
// }
 
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    inStock: 0,
    inactive: 0,
    averageCost: 0,
    averageSale: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch("/api/products/metrics");
      const data = await response.json();
      setMetrics(data);
    };

    fetchMetrics();
  }, []);

  return (
    <div className="sm:ml-14 p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total de Produtos</h2>
          <p className="text-3xl">{metrics.totalProducts}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Produtos em Estoque</h2>
          <p className="text-3xl">{metrics.inStock}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Produtos Inativos</h2>
          <p className="text-3xl">{metrics.inactive}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Valor Médio (Venda)</h2>
          <p className="text-3xl">R$ {metrics.averageSale.toFixed(2)}</p>
        </div>
      </div>
    </div>

  )
}

export default Dashboard;

