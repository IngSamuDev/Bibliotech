import { useState, useEffect } from 'react';
import { Plus, Users, Mail, Globe } from 'lucide-react';
import { usersApi } from '../../api/usersApi';
import { rolesApi } from '../../api/catalogApi';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToToggle, setUserToToggle] = useState(null);
  const [form, setForm] = useState({ nombre: '', email: '', password: '', id_roles: 3 });
  const [formErrors, setFormErrors] = useState({});
  const { showSuccess, showError, showWarning } = useNotification();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError('Error al cargar los usuarios');
      showError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    rolesApi.getAll().then((data) => setRoles(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  const openCreate = () => {
    setSelectedUser(null);
    setForm({ nombre: '', email: '', password: '', id_roles: 3 });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (user) => {
    const role = roles.find((r) => r.nombre_roles === user.nombre_roles);
    setSelectedUser(user);
    setForm({
      nombre: user.nombre_usuarios,
      email: user.email_usuarios,
      password: '',
      id_roles: role?.id_roles || 3
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre || !form.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es obligatorio';
    } else if (form.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !form.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!selectedUser) {
      if (!form.password) {
        newErrors.password = 'La contraseña es obligatoria';
      } else if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password)) {
        newErrors.password = 'La contraseña debe tener mínimo 6 caracteres, una letra y un número';
      }
    }
    return newErrors;
  };

  const saveUser = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      showWarning('Por favor, corrige los errores en el formulario.');
      return;
    }

    setFormErrors({});
    setSubmitting(true);
    try {
      if (selectedUser) {
        await usersApi.update(selectedUser.id_usuarios, {
          nombre: form.nombre,
          email: form.email,
          id_roles: Number(form.id_roles)
        });
        showSuccess('Usuario actualizado con éxito');
      } else {
        await usersApi.create({ ...form, id_roles: Number(form.id_roles) });
        showSuccess('Usuario creado con éxito');
      }
      setModalOpen(false);
      await fetchUsers();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al guardar usuario';
      setError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const openToggleStatus = (user) => {
    setUserToToggle(user);
    setStatusModalOpen(true);
  };

  const toggleStatus = async () => {
    if (!userToToggle) return;
    setSubmitting(true);
    setError('');
    try {
      await usersApi.setStatus(userToToggle.id_usuarios, !userToToggle.estado_usuarios);
      showSuccess(`Usuario ${userToToggle.estado_usuarios ? 'desactivado' : 'activado'} con éxito`);
      setStatusModalOpen(false);
      setUserToToggle(null);
      await fetchUsers();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al cambiar estado del usuario';
      setError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const openDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    setSubmitting(true);
    setError('');
    try {
      await usersApi.delete(userToDelete.id_usuarios);
      showSuccess('Usuario eliminado con éxito');
      setDeleteModalOpen(false);
      setUserToDelete(null);
      await fetchUsers();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al eliminar usuario';
      setError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const roleBadge = (rol) => {
    const colors = {
      ADMIN: 'bg-violet-100 text-violet-700',
      BIBLIOTECARIO: 'bg-blue-100 text-blue-700',
      LECTOR: 'bg-emerald-100 text-emerald-700'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[rol] || 'bg-gray-100 text-gray-600'}`}>
        {rol}
      </span>
    );
  };

  const authBadge = (u) => {
    const isGoogle = u.auth_provider_usuarios === 'google' || u.email_usuarios?.toLowerCase().endsWith('@gmail.com');
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isGoogle ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'
      }`}>
        {isGoogle ? <Globe className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
        {isGoogle ? 'Google/Gmail' : 'Normal'}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} usuarios registrados</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Añadir usuario</Button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} className="mb-4" />}

      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Users className="w-10 h-10 mb-2" />
          <p className="text-sm">No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-medium text-slate-500">Usuario</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Rol</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Ingreso</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Registro</th>
                <th className="text-right px-4 py-3 font-medium text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id_usuarios} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
                        {u.nombre_usuarios?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{u.nombre_usuarios}</p>
                        <p className="text-xs text-slate-500">{u.email_usuarios}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{roleBadge(u.nombre_roles)}</td>
                  <td className="px-4 py-3">{authBadge(u)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.estado_usuarios ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.estado_usuarios ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(u.fecha_creacion_usuarios).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(u)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Editar</button>
                      <button onClick={() => openToggleStatus(u)} disabled={submitting} className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100">
                        {u.estado_usuarios ? 'Desactivar' : 'Activar'}
                      </button>
                      <button onClick={() => openDelete(u)} disabled={submitting} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedUser ? 'Editar usuario' : 'Añadir usuario'} maxWidth="max-w-2xl">
        <form onSubmit={saveUser} noValidate>
          <Input
            label="Nombre completo"
            name="nombre"
            value={form.nombre}
            onChange={(e) => {
              setForm({ ...form, nombre: e.target.value });
              if (formErrors.nombre) setFormErrors({ ...formErrors, nombre: '' });
            }}
            error={formErrors.nombre}
            required
          />
          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
            }}
            error={formErrors.email}
            required
          />
          {!selectedUser && (
            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
              }}
              error={formErrors.password}
              required
            />
          )}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-800">Rol</label>
            <select value={form.id_roles} onChange={(e) => setForm({ ...form, id_roles: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
              {roles.map((role) => <option key={role.id_roles} value={role.id_roles}>{role.nombre_roles}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" isLoading={submitting} className="flex-1">Guardar</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Eliminar Usuario"
        entityName="el usuario"
        itemName={userToDelete?.nombre_usuarios}
        onConfirm={deleteUser}
        isLoading={submitting}
        error={error}
        onDismissError={() => setError('')}
      />

      <ConfirmModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={userToToggle?.estado_usuarios ? 'Desactivar Usuario' : 'Activar Usuario'}
        message={`¿Estás seguro de que deseas ${userToToggle?.estado_usuarios ? 'desactivar' : 'activar'} a "${userToToggle?.nombre_usuarios || 'este usuario'}"?`}
        confirmText={userToToggle?.estado_usuarios ? 'Desactivar' : 'Activar'}
        confirmVariant={userToToggle?.estado_usuarios ? 'danger' : 'primary'}
        onConfirm={toggleStatus}
        isLoading={submitting}
        error={error}
        onDismissError={() => setError('')}
      />
    </div>
  );
};

export default UsersManagement;
