import React, { useState, useEffect } from 'react';

// --- Helper Components defined within the same file for encapsulation ---

// Simple Modal for the "Access Denied" message
const AccessDeniedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-surface-color border border-border-color rounded-2xl p-8 text-center shadow-lg shadow-red-500/20 transform transition-all duration-300 ease-in-out scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
        <p className="text-gray-300 mb-6">The password you entered is incorrect.</p>
        <button 
          onClick={onClose}
          className="border border-red-500 text-red-500 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all duration-300 ease-in-out"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// Clock and Date Widget
const Clock = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const day = date.toLocaleDateString('en-IN', { weekday: 'long' });
    const fullDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="text-center md:text-left">
            <h2 className="font-mono text-5xl md:text-6xl font-bold tracking-tighter text-white">{time}</h2>
            <p className="text-lg md:text-xl font-light text-gray-300 tracking-wider">{day}</p>
            <p className="text-sm text-gray-400 tracking-wide">{fullDate}</p>
        </div>
    );
};

// Simple Calendar Widget
const Calendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const todayDate = today.getDate();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const paddingDays = Array(firstDayOfMonth).fill(null);
    const calendarDays = [...paddingDays, ...days];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="w-full max-w-xs mx-auto md:mx-0">
             <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-gray-400 mb-3">
                {dayNames.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {calendarDays.map((day, index) => (
                    <div key={index} className={`font-mono text-sm w-8 h-8 flex items-center justify-center rounded-full ${day ? 'text-gray-200' : ''} ${day === todayDate ? 'bg-red-500 text-black font-bold' : ''}`}>
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};


// Random Quote Widget
const Quote = () => {
    const [quote, setQuote] = useState({ content: "Loading quote...", author: "" });

    useEffect(() => {
        fetch('https://api.quotable.io/random?tags=technology|wisdom|famous-quotes')
            .then(res => res.json())
            .then(data => setQuote(data))
            .catch(() => setQuote({ content: "The best way to predict the future is to create it.", author: "Alan Kay" }));
    }, []);

    return (
        <div className="border-l-2 border-red-500 pl-4">
            <blockquote className="text-lg italic text-gray-200">"{quote.content}"</blockquote>
            <cite className="block text-right mt-2 text-sm font-semibold text-gray-400 tracking-wider">— {quote.author}</cite>
        </div>
    );
};


// --- The Main Password Screen Component ---

const PasswordScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isDeniedModalOpen, setIsDeniedModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setIsDeniedModalOpen(true);
      setPassword('');
    }
  };

  return (
    <>
      <AccessDeniedModal isOpen={isDeniedModalOpen} onClose={() => setIsDeniedModalOpen(false)} />
      <div className="flex items-center justify-center min-h-screen bg-black text-white p-4 md:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-surface-color border border-border-color rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl shadow-red-500/10">
          
          {/* Left Column: Widgets */}
          <div className="flex flex-col justify-between space-y-8 md:space-y-12">
            <Clock />
            <Calendar />
            <Quote />
          </div>

          {/* Right Column: Login Form */}
          <div className="flex flex-col items-center justify-center bg-black/50 p-8 rounded-xl border border-border-color">
             <h1 className="text-2xl font-bold text-center text-white tracking-widest uppercase mb-2">
                Algorithm Mastery
             </h1>
             <p className="text-sm text-gray-400 mb-8 text-center">Private Access</p>
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div>
                <label htmlFor="password" className="form-label mb-2 block text-center">
                  Enter Access Code
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input text-center tracking-[4px] font-mono"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                className="w-full border border-red-500 text-red-500 px-5 py-3 rounded-xl hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all duration-300 ease-in-out font-semibold tracking-wider"
              >
                UNLOCK
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordScreen;
