import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import ViewAllSpkPage from './pages/ViewAllSpkPage';
import SpkManagerPage from './pages/SpkManagerPage';
import Header from './components/Header';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((state) => state.checkSession);
  
  const isValid = checkSession();
  
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-mandiri-bg overflow-hidden font-sans">
      <Header />
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}

function ProtectedSpkManagerRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  
  if (!user || (user.role !== 'admin' && user.divisi?.toLowerCase() !== 'print')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-mandiri-bg overflow-hidden font-sans">
      <Header />
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}

function App() {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <ViewAllSpkPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/manager" 
        element={
          <ProtectedSpkManagerRoute>
            <SpkManagerPage />
          </ProtectedSpkManagerRoute>
        } 
      />
    </Routes>
  );
}

export default App;
