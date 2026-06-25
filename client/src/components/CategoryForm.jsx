const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Soumettre",
  handleDelete,
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        className="w-full px-4 py-2.5 text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder-stone-400"
        placeholder="Nom de la catégorie"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors"
        >
          {buttonText}
        </button>
        {handleDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition-colors"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
