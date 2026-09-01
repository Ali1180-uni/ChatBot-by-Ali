import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import MarkdownMessage from '../components/MarkdownMessage';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineIcon from '@mui/icons-material/AccountCircleOutlined';

const suggestions = ['Help me with maths', 'What can you do?', 'Create a website'];

function HistorySkeleton() {
  return <div className="mx-auto flex min-h-[470px] w-full max-w-2xl flex-col justify-center gap-6 animate-pulse"><div className="h-4 w-32 rounded bg-[#e4e1d9]" /><div className="ml-auto h-16 w-2/3 rounded-2xl bg-[#e4e1d9]" /><div className="h-20 w-3/4 rounded-2xl bg-[#e4e1d9]" /><div className="ml-auto h-12 w-1/2 rounded-2xl bg-[#e4e1d9]" /></div>;
}

function AutoAwesomeIcon() {
  return <img src="/chatLogo.svg" alt="Ali.ai assistant" className="h-9 w-9 object-contain" />;
}

function ReactMarkdown({ children }) {
  return <MarkdownMessage content={children} />;
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('aliUser') || 'null'));
  const [authMode, setAuthMode] = useState('login');
  const chatWindowRef = useRef(null);
  const token = localStorage.getItem('aliToken');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ defaultValues: { message: '' } });

  useEffect(() => {
    if (!user || !token) { setIsHistoryLoading(false); return; }
    fetch('/api/history', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setMessages(data.messages || []))
      .catch(() => { localStorage.removeItem('aliToken'); localStorage.removeItem('aliUser'); setUser(null); toast.error('Your session expired. Please sign in again.'); })
      .finally(() => setIsHistoryLoading(false));
  }, [user, token]);

  useEffect(() => {
    if (chatWindowRef.current) chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [messages, isLoading]);

  async function sendMessage({ message }) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || !user) return;
    setMessages((current) => [...current, { text: trimmedMessage, sender: 'user' }]);
    reset();
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${localStorage.getItem('aliToken')}` }, body: JSON.stringify({ message: trimmedMessage }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
      setMessages((current) => [...current, { text: data.choices[0].message.content, sender: 'bot' }]);
    } catch (error) {
      setMessages((current) => [...current, { text: error.message || 'Unable to connect. Please try again.', sender: 'bot' }]);
      toast.error(error.message || 'Unable to connect. Please try again.');
    } finally { setIsLoading(false); }
  }

  function signOut() {
    localStorage.removeItem('aliToken');
    localStorage.removeItem('aliUser');
    setUser(null);
    setMessages([]);
    toast.success('You have been signed out.');
  }

  function handleAuthSuccess(data) {
    localStorage.setItem('aliToken', data.token);
    localStorage.setItem('aliUser', JSON.stringify(data.user));
    setUser(data.user);
    toast.success(authMode === 'login' ? 'Welcome back.' : 'Account created successfully.');
  }

  if (!user) return <AuthPanel mode={authMode} setMode={setAuthMode} onSuccess={handleAuthSuccess} />;

  return (
    <main className="flex h-full min-h-0 w-full overflow-hidden">
      <div className="flex min-h-0 w-full overflow-hidden border-y border-[#d1cec5] bg-[#f7f6f2]">
        <aside className="hidden w-[235px] shrink-0 flex-col border-r border-[#dfddd6] bg-[#f0efeb] p-5 md:flex">
          <div className="flex items-center justify-between"><p className="font-display text-sm font-bold">Workspace</p><button aria-label="New conversation" onClick={() => { setMessages([]); toast.info('Started a new conversation.'); }} className="rounded-lg p-2 text-[#77746d] hover:bg-[#e4e2dc]"><AddCommentOutlinedIcon fontSize="small" /></button></div>
          <div className="mt-8 rounded-xl border border-[#d8d5cc] bg-[#f7f6f2] p-3"><ChatBubbleOutlineIcon fontSize="small" className="text-[#9d9990]" /><p className="mt-3 truncate text-xs font-semibold">{messages.length ? 'Today’s conversation' : 'New conversation'}</p><p className="mt-1 text-xs text-[#aaa69d]">Saved to your history</p></div>
          <div className="mt-auto flex items-center gap-3 border-t border-[#d8d5cc] pt-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#292929] text-xs font-bold text-white">{user.name?.[0]?.toUpperCase()}</span><span className="min-w-0 flex-1 truncate text-sm font-semibold">{user.name}</span><button aria-label="Sign out" onClick={signOut} className="text-[#8d8980] hover:text-[#292929]"><LogoutIcon fontSize="small" /></button></div>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[#dfddd6] px-5 py-4 sm:px-8"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#292929] text-white"><SmartToyOutlinedIcon fontSize="small" /></span><div><p className="font-display text-sm font-bold">Ali’s Assistant</p><p className="flex items-center gap-1.5 text-xs text-[#96928a]"><i className="h-1.5 w-1.5 rounded-full bg-[#789978]" /> Online</p></div></div><button onClick={signOut} className="flex items-center gap-2 text-xs font-bold text-[#88847c] hover:text-[#292929] md:hidden"><LogoutIcon fontSize="small" /> Exit</button></div>
          <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-12" ref={chatWindowRef}>
            {isHistoryLoading ? <HistorySkeleton /> : messages.length === 0 ? <div className="flex h-full min-h-[470px] flex-col items-center justify-center text-center"><div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#292929] text-white shadow-[8px_8px_0_#d6d3cb]"><AutoAwesomeIcon /></div><h1 className="font-display text-3xl font-bold tracking-[-0.05em]">What’s on your mind?</h1><p className="mt-3 max-w-sm text-sm leading-6 text-[#96928a]">Ask a question, untangle a problem, or start something new.</p><div className="mt-9 flex flex-wrap justify-center gap-2">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setValue('message', suggestion, { shouldValidate: true })} className="rounded-full border border-[#d7d4cb] bg-white px-4 py-2.5 text-xs font-semibold text-[#77746d] transition-colors hover:border-[#292929] hover:text-[#292929]">{suggestion}</button>)}</div></div> : <div className="mx-auto flex max-w-2xl flex-col gap-7">{messages.map((message, index) => <div key={`${message.sender}-${index}`} className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${message.sender === 'user' ? 'bg-[#dedbd3] text-[#69665f]' : 'bg-[#292929] text-white'}`}>{message.sender === 'user' ? <PersonOutlineIcon fontSize="small" /> : <SmartToyOutlinedIcon fontSize="small" />}</span><div className={`max-w-[82%] ${message.sender === 'user' ? 'text-right' : ''}`}><p className="mb-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#aaa69d]">{message.sender === 'user' ? 'You' : 'Assistant'}</p><div className={`rounded-2xl px-4 py-3 text-sm leading-7 ${message.sender === 'user' ? 'rounded-tr-sm bg-[#292929] text-white' : 'rounded-tl-sm border border-[#e0ddd5] bg-white text-[#5f5c55]'}`}>{message.sender === 'bot' ? <ReactMarkdown>{message.text}</ReactMarkdown> : message.text}</div></div></div>)}{isLoading && <div className="flex items-center gap-3 text-[#aaa69d]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#292929] text-white"><SmartToyOutlinedIcon fontSize="small" /></span><span className="flex gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#aaa69d]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#aaa69d] [animation-delay:150ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#aaa69d] [animation-delay:300ms]" /></span></div>}</div>}
          </div>
          <form onSubmit={handleSubmit(sendMessage)} className="border-t border-[#dfddd6] p-4 sm:px-8 sm:py-5"><div className={`flex items-center gap-3 rounded-2xl border bg-white p-2 pl-4 shadow-sm ${errors.message ? 'border-[#b96b5f]' : 'border-[#d7d4cb]'}`}><input {...register('message', { required: 'Write a message first.', maxLength: { value: 2000, message: 'Keep messages under 2,000 characters.' } })} placeholder="Ask anything..." disabled={isLoading} className="min-w-0 flex-1 bg-transparent text-sm text-[#292929] outline-none placeholder:text-[#aaa69d]" /><button aria-label="Send message" disabled={isLoading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#292929] text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30"><SendIcon fontSize="small" /></button></div>{errors.message && <p className="mt-2 text-xs text-[#a04d43]">{errors.message.message}</p>}<p className="mt-2 text-center text-[10px] text-[#aaa69d]">Ali.ai can make mistakes. Check important information.</p></form>
        </section>
      </div>
    </main>
  );
}

function AuthPanel({ mode, setMode, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ mode: 'onBlur' });
  const [requestError, setRequestError] = useState('');

  async function submitAuth(formData) {
    setRequestError('');
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.');
      onSuccess(data);
      reset();
    } catch (error) { setRequestError(error.message); toast.error(error.message); }
  }

  const fieldClass = (field) => `w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-[#292929] ${errors[field] ? 'border-[#b96b5f]' : 'border-[#d7d4cb]'}`;
  return <main className="flex flex-1 items-center justify-center px-5 py-16"><div className="w-full max-w-[420px] rounded-[28px] border border-[#d1cec5] bg-[#f7f6f2] p-7 shadow-[0_18px_50px_rgba(67,64,57,.08)] sm:p-10"><div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#292929] text-white"><AutoAwesomeIcon /></div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#96928a]">Welcome to Ali.ai</p><h1 className="mt-3 font-display text-4xl font-bold tracking-[-.06em]">{mode === 'login' ? 'Welcome back.' : 'Make an account.'}</h1><p className="mt-3 text-sm leading-6 text-[#858179]">{mode === 'login' ? 'Sign in to continue your conversations.' : 'Keep your ideas and chat history together.'}</p><form onSubmit={handleSubmit(submitAuth)} className="mt-8 space-y-4">{mode === 'register' && <div><input {...register('name', { required: 'Your name is required.', minLength: { value: 2, message: 'Use at least 2 characters.' } })} placeholder="Your name" className={fieldClass('name')} />{errors.name && <p className="mt-1 text-xs text-[#a04d43]">{errors.name.message}</p>}</div>}<div><input {...register('email', { required: 'Email is required.', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' } })} type="email" placeholder="Email address" className={fieldClass('email')} />{errors.email && <p className="mt-1 text-xs text-[#a04d43]">{errors.email.message}</p>}</div><div><input {...register('password', { required: 'Password is required.', minLength: { value: 8, message: 'Password must be at least 8 characters.' } })} type="password" placeholder="Password (8+ characters)" className={fieldClass('password')} />{errors.password && <p className="mt-1 text-xs text-[#a04d43]">{errors.password.message}</p>}</div>{requestError && <p className="text-sm text-[#a04d43]">{requestError}</p>}<button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#292929] px-4 py-3.5 text-sm font-bold text-white disabled:opacity-50">{isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowUpwardIcon fontSize="small" /></button></form><button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setRequestError(''); }} className="mt-6 w-full text-center text-xs font-semibold text-[#858179] hover:text-[#292929]">{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button></div></main>;
}

export default Chat;
