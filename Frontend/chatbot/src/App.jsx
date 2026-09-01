import { BrowserRouter, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

function AppShell() {
  const location = useLocation();
  const isChatRoute = location.pathname === '/chat';

  useEffect(() => {
    const titles = { '/': 'Ali.ai | Think clearly', '/chat': 'Ali.ai | Chat', '/about': 'Ali.ai | About' };
    document.title = titles[location.pathname] || titles['/'];
  }, [location.pathname]);

  return <div className={isChatRoute ? 'flex h-[100dvh] flex-col overflow-hidden bg-[#e9e8e4]' : 'flex min-h-screen flex-col bg-[#e9e8e4]'}><Navbar /><div className="min-h-0 flex-1"><AppRoutes /></div>{!isChatRoute && <Footer />}<ToastContainer position="top-right" autoClose={3500} hideProgressBar theme="light" /></div>;
}

export default App;
