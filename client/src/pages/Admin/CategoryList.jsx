import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Nom de la catégorie requis");
      return;
    }
    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} a été créée.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Création de la catégorie échouée, veuillez réessayer");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Nom de la catégorie requis");
      return;
    }
    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} a été modifié`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} a été supprimé`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Suppression de la catégorie échouée. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminMenu />

      <main className="max-w-2xl mx-auto px-5 py-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Administration
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">
            Gestion des catégories
          </h1>
        </div>

        {/* Create form */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">
            Nouvelle catégorie
          </h2>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
            buttonText="Créer"
          />
        </div>

        {/* Category list */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">
            Catégories existantes
            <span className="ml-2 text-xs font-normal text-stone-400">
              ({categories?.length ?? 0})
            </span>
          </h2>

          {categories?.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-6">
              Aucune catégorie pour l'instant.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <button
                  key={category._id}
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                  className="px-4 py-1.5 rounded-full text-sm font-medium border border-stone-200 text-stone-600 bg-stone-50 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit modal */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <div className="p-1">
          <h3 className="text-base font-semibold text-stone-800 mb-4">
            Modifier « {selectedCategory?.name} »
          </h3>
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText="Enregistrer"
            handleDelete={handleDeleteCategory}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;
