
import {ChangeEvent, FormEvent, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Product } from "@/pages/products.page";


interface StoreProductDialogprops {
  onProductAdded: (newProduct: Product ) => void;
}

export const StoreProductDialog = ({ onProductAdded }: StoreProductDialogprops) => {
  
  
  const [productData, setProductData] = useState({
    code: "",
    description: "",
    reference: "",
    cost_price: "",
    sale_price: "",
    inStock: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...productData, 
          cost_price: Number(productData.cost_price), 
          sale_price: Number(productData.cost_price), 
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar o produto.");
      }

      toast.success("Produto adicionado com sucesso!")

      const newProduct = await response.json();
      onProductAdded(newProduct); // Atualiza a lista de produtos no componente pai
      setProductData({
        code: "",
        description: "",
        reference: "",
        cost_price:"",
        sale_price:"",
        inStock: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" text-white px-4 py-2 rounded">
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="code" className="block text-sm font-medium">
              Código
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={productData.code}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="reference" className="block text-sm font-medium">
              Referência
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={productData.reference}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="cost_price" className="block text-sm font-medium">
              Valor de Custo
            </label>
            <input
              type="number"
              id="cost_price"
              name="cost_price"
              value={productData.cost_price}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="sale_price" className="block text-sm font-medium">
              Valor de Venda
            </label>
            <input
              type="number"
              id="sale_price"
              name="sale_price"
              value={productData.sale_price}
              onChange={handleChange}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={productData.inStock}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2">Em Estoque</span>
            </label>
          </div>
          <DialogFooter>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


