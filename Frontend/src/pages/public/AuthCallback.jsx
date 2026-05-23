import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(user));
        window.location.href = '/';
      } catch (error) {
        console.error('Error parsing auth data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default AuthCallback;
