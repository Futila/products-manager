import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";


import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogFooter } from "../ui/dialog";
import { Pencil } from "lucide-react";



type ProductType = {
  id: string, 
  code: string, 
  description: string, 
  reference: string, 
  cost_price: number, 
  sale_price: number, 
  inStock: boolean, 
  isActive: boolean
}


interface StoreProductDialogProps  {
  onProductSaved: (product: ProductType) => void;
  product?: ProductType // The product to be updated (optional)
  action?: "add" | "edit"
}


export function StoreProductDialog ({onProductSaved, product, action}: StoreProductDialogProps) {

  const [productData, setProductData] = useState({
    code: "", 
    description: "", 
    reference: "", 
    cost_price: "", 
    sale_price: "", 
    inStock: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  //fill the product datas when opening to edit 
  useEffect(() => {

    if(product) {
      setProductData({
        code: product.code, 
        description: product.description, 
        reference: product.reference, 
        cost_price: product.cost_price.toString(),
        sale_price: product.sale_price.toString(),
        inStock: product.inStock
      })
    }
  }, [product])


  function handleChange (e: ChangeEvent<HTMLInputElement>){
    const {name, value, type, checked} = e.target

    setProductData({
      ...productData, 
      [name]: type === "checkbox" ? checked : value
    })
  }


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/products${product ? `/${product.id}`: ""}`, {
        method: product ? "PUT": "POST", // PUT to edit and POST do add a new product
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...productData, 
          cost_price: Number(productData.cost_price),
          sale_price: Number(productData.sale_price),
        })
      })

      if(!response.ok) {
        throw new Error(product ? "Erro ao editar o produto." : "Erro ao adicionar o produto.")
      }

    const savedProduct = await response.json()
    onProductSaved(savedProduct)
    
    toast.success(product ? "Produto editado com sucesso!" : "Produto adicionado com sucesso!");

      setProductData({
        code: "",
        description: "",
        reference: "",
        cost_price: "",
        sale_price: "",
        inStock: false,
      });
    }catch(err){
      setError((err as Error).message || "Erro inesperado.");
    }finally {
      setLoading(false)

    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
       {action && action === "add" ? ( <Button className="text-white px-4 py-2 rounded">
          {"Adicionar Produto"}
        </Button>): (<button><Pencil className="w-4 h-4"/></button>)}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Adicionar Novo Produto"}</DialogTitle>
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
              {loading ? (product ? "Salvando..." : "Adicionando...") : product ? "Salvar Alterações" : "Adicionar"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  );
   
}