import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu.jsx";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const inputClass =
  "w-full px-4 py-2.5 text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder-stone-400";

const labelClass = "block text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);
      if (data.error) {
        toast.error("Échec de la création du produit. Veuillez réessayer.");
      } else {
        toast.success(`${data.name} a été créé.`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Échec de la création du produit. Veuillez réessayer.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex">
        <AdminMenu />

        <main className="flex-1 px-5 py-10 max-w-3xl mx-auto w-full">

          {/* Page header */}
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
              Administration
            </p>
            <h1 className="text-2xl font-semibold text-stone-800">
              Créer un produit
            </h1>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col gap-6">

            {/* Image upload */}
            <div>
              <label className={labelClass}>Image du produit</label>

              {imageUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                  <img
                    src={imageUrl}
                    alt="Aperçu"
                    className="w-full max-h-56 object-cover"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-sm font-medium">Changer l'image</span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={uploadFileHandler}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 w-full py-10 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span className="text-sm text-stone-400">
                    Cliquer pour téléverser une image
                  </span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={uploadFileHandler}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="h-px bg-stone-100" />

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label htmlFor="name" className={labelClass}>Nom</label>
                <input
                  id="name"
                  type="text"
                  className={inputClass}
                  placeholder="Ex : RTX 4090"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="price" className={labelClass}>Prix (F CFA)</label>
                <input
                  id="price"
                  type="number"
                  className={inputClass}
                  placeholder="Ex : 850000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="quantity" className={labelClass}>Quantité</label>
                <input
                  id="quantity"
                  type="number"
                  className={inputClass}
                  placeholder="Ex : 10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="brand" className={labelClass}>Marque</label>
                <input
                  id="brand"
                  type="text"
                  className={inputClass}
                  placeholder="Ex : NVIDIA"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="stock" className={labelClass}>Quantité en stock</label>
                <input
                  id="stock"
                  type="number"
                  className={inputClass}
                  placeholder="Ex : 5"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="category" className={labelClass}>Catégorie</label>
                <select
                  id="category"
                  className={inputClass}
                  onChange={(e) => setCategory(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Choisir une catégorie</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

            </div>

            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea
                id="description"
                rows={4}
                className={inputClass}
                placeholder="Décrivez le produit..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="h-px bg-stone-100" />

            {/* Submit */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors"
              >
                Créer le produit
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;