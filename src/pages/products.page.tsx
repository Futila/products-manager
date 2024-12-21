import { ProductStatus } from "@/components/product-status";
import { StoreProductDialog2 } from "@/components/store-product-dialog";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface Product {
  id: string, 
  code: string, 
  description: string, 
  sale_price: number, 
  inStock: boolean, 
  reference: string, 
  cost_price: number, 
  isActive: boolean
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({ active: true });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      
      const response = await fetch(`/api/products?page=${page}&active=${filters.active}`);
      const data: Product[] = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, [filters, page]);

  // const handleDeleteProduct = (id: string) => {
  //   // Fazer requisição para excluir produto
  // };

  return (
    <div className="sm:ml-14 p-4">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <div className="mb-4 flex justify-between">
        {/* <StoreProductDialog onProductAdded={handleProductAdded}/> */}
        <StoreProductDialog2
          action="add"
          onProductSaved={(updatedProduct) => {
          setProducts([...products, updatedProduct]);
        }}
    />
        <select
          className="border rounded px-2 py-1"
          value={filters.active ? "ativos" : "inativos"}
          onChange={(e) => setFilters({ active: e.target.value === "ativos" })}
        >
          <option value="ativos">Ativos</option>
          <option value="inativos">Inativos</option>
        </select>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Código</th>
            <th className="border border-gray-300 px-4 py-2">Descrição</th>
            <th className="border border-gray-300 px-4 py-2">Valor</th>
            <th className="border border-gray-300 px-4 py-2">Estoque</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border border-gray-300 px-4 py-2">{product.code}</td>
              <td className="border border-gray-300 px-4 py-2">{product.description}</td>
              <td className="border border-gray-300 px-4 py-2">R$ {product.sale_price.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2">{product.inStock ? "Sim" : "Não"}</td>
              <td className="border border-gray-300 px-4 py-2">
                {product.isActive ? <ProductStatus status="active"/> : <ProductStatus status="inactive"/>}
                </td>
              <td className="border border-gray-300 px-4 py-2">
              
                <StoreProductDialog2 
                product={product}    
                onProductSaved={(updatedProduct) => {
                  // Atualize a lista de produtos
                  setProducts((prevProducts) =>
                    prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
                  );}}  
                  />
                {product.isActive && 
                (<button  className="text-red-500 ml-2">
                  <Trash2/>
                </button>)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-4 py-2">
          Anterior
        </button>
        <button onClick={() => setPage(page + 1)} className="px-4 py-2">
          Próximo
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
