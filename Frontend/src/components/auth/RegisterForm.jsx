import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { validateEmail, validateName, validatePassword } from '../../utils/validators';

const RegisterForm = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre completo es obligatorio';
    else if (!validateName(form.nombre)) newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    if (!form.email.trim()) newErrors.email = 'El correo electrónico es obligatorio';
    else if (!validateEmail(form.email)) newErrors.email = 'Ingresa un correo electrónico válido';
    if (!form.password) newErrors.password = 'La contraseña es obligatoria';
    else if (!validatePassword(form.password)) newErrors.password = 'La contraseña debe tener mínimo 6 caracteres, una letra y un número';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await onSubmit(form.nombre, form.email, form.password);
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && (
        <ErrorMessage message={serverError} onDismiss={() => setServerError('')} className="mb-4" />
      )}

      <Input
        label="Nombre completo"
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Tu nombre"
        error={errors.nombre}
        required
      />

      <Input
        label="Correo electrónico"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="tu@email.com"
        error={errors.email}
        required
      />

      <Input
        label="Contraseña"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Mínimo 6 caracteres"
        error={errors.password}
        showPasswordToggle
        required
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Repite tu contraseña"
        error={errors.confirmPassword}
        showPasswordToggle
        required
      />

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full mt-2"
      >
        Crear cuenta
      </Button>
    </form>
  );
};

export default RegisterForm;
