import { useEffect, useState } from "react";
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import AdminMenu from "./AdminMenu";

const inputClass =
  "w-full px-3 py-1.5 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-800 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const cancelEdit = () => setEditableUserId(null);

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err.data?.message || err.error);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-stone-50 p-10">
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminMenu />

      <main className="max-w-5xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Administration
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">
            Utilisateurs
            <span className="ml-2 text-base font-normal text-stone-400">
              ({users.length})
            </span>
          </h1>
        </div>

        {/* Table */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium hidden sm:table-cell">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium hidden sm:table-cell">
                    Rôle
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wide text-stone-400 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((user) => {
                  const isEditing = editableUserId === user._id;
                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-4 py-3 hidden sm:table-cell text-stone-400 font-mono text-xs">
                        {user._id.slice(-8)}
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) =>
                              setEditableUserName(e.target.value)
                            }
                            className={inputClass}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-stone-700 font-medium">
                              {user.username}
                            </span>
                            {!user.isAdmin && (
                              <button
                                onClick={() =>
                                  toggleEdit(
                                    user._id,
                                    user.username,
                                    user.email,
                                  )
                                }
                                className="text-stone-400 hover:text-[var(--primary)] transition-colors"
                                aria-label="Modifier"
                              >
                                <FiEdit2 size={13} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editableUserEmail}
                            onChange={(e) =>
                              setEditableUserEmail(e.target.value)
                            }
                            className={inputClass}
                          />
                        ) : (
                          <span className="text-stone-500">{user.email}</span>
                        )}
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium">
                            <FiCheck size={10} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs font-medium">
                            Utilisateur
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => updateHandler(user._id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                aria-label="Confirmer"
                              >
                                <FiCheck size={14} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
                                aria-label="Annuler"
                              >
                                <FiX size={14} />
                              </button>
                            </>
                          ) : (
                            !user.isAdmin && (
                              <button
                                onClick={() => deleteHandler(user._id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                aria-label="Supprimer"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserList;
