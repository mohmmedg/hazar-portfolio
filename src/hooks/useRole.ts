import useAuth from './useAuth';

export default function useRole() {
  const { role, isAdmin, loading } = useAuth();
  return { role, isAdmin, loading };
}
