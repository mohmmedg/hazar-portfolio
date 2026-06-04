import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminToast from './admin/AdminToast';
import useAuth from '../hooks/useAuth';

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export default function AdminLoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (!auth.loading && auth.isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [auth.loading, auth.isAdmin, navigate]);

  const triggerToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3500);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await auth.login(email, password);
      triggerToast('success', 'Successfully signed in. Redirecting to admin…');
      navigate('/admin', { replace: true });
    } catch (error: any) {
      const message = error?.message || 'Unable to sign in. Please check your credentials.';
      triggerToast('error', message);
    }
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-navy-dark text-white">
        <p className="text-sm uppercase tracking-[0.25em] text-white/70">Checking auth status...</p>
      </div>
    );
  }

  return (
    <>
      <AdminLogin onLogin={handleLogin} onBackToSite={() => navigate('/')} />
      <AdminToast toasts={toasts} />
    </>
  );
}
