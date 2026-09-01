import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? 'text-[#252525]' : 'text-[#7d7b76] hover:text-[#252525]'}`;

  return (
    <header className="relative z-20 border-b border-[#d7d5cf] bg-[#e9e8e4]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3ed] p-2"><img src="/title.svg" alt="Ali.ai" className="h-full w-full object-contain" /></span>
          <span className="font-display text-lg font-bold tracking-[-0.04em]">Ali<span className="text-[#8d8a83]">.ai</span></span>
        </Link>
        <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/chat" className={linkClass}>Chat</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </nav>
        <Link to="/chat" className="hidden items-center gap-2 rounded-full bg-[#292929] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:flex">
          Start chatting <ArrowOutwardIcon fontSize="small" />
        </Link>
        <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} className="rounded-lg p-2 text-[#292929] sm:hidden">
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <nav className="absolute left-0 right-0 top-[76px] border-b border-[#d7d5cf] bg-[#f5f3ed] px-5 py-5 shadow-lg sm:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-5">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/chat" className={linkClass} onClick={() => setOpen(false)}>Chat</NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
