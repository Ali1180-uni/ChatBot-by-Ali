import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import About from '../pages/About';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
