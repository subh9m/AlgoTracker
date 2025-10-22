import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Components defined within the same file for encapsulation ---

const AccessDeniedModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface-color border border-border-color rounded-2xl p-8 text-center shadow-lg shadow-red-500/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Clock = () => {
  const [date, setDate] = useState(new Date());
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    const timerId = setInterval(() => {
      setDate(new Date());
      setShowColon(prev => !prev);
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const timeParts = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).formatToParts(date);

  const day = date.toLocaleDateString('en-IN', { weekday: 'long' });
  const fullDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="text-center md:text-left">
      <h2 className="font-mono text-5xl md:text-6xl font-bold tracking-tighter text-white flex justify-center md:justify-start items-baseline">
        {timeParts.map((part, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {part.type === 'literal' && part.value === ':' ? (
              <span className={`transition-opacity duration-200 ${showColon ? 'opacity-100' : 'opacity-0'}`}>
                {part.value}
              </span>
            ) : (
              <span>{part.value}</span>
            )}
          </motion.span>
        ))}
      </h2>
      <p className="text-lg md:text-xl font-light text-gray-300 tracking-wider">{day}</p>
      <p className="text-sm text-gray-400 tracking-wide">{fullDate}</p>
    </div>
  );
};

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
          <div key={index} className={`font-mono text-sm w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${day ? 'text-gray-200' : ''} ${day === todayDate ? 'bg-red-500 text-black font-bold' : ''}`}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

const WeatherIcon = ({ code }) => {
    const iconMap = {
        sun: <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>,
        cloud: (
            <div className="relative w-10 h-6">
                <div className="absolute -bottom-1 left-0 w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 right-0 w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
        ),
        rain: (
            <div className="relative w-10 h-6">
                <div className="absolute -bottom-1 left-0 w-6 h-6 bg-gray-400 rounded-full"></div>
                <div className="absolute -bottom-1 right-0 w-8 h-8 bg-gray-400 rounded-full"></div>
                <div className="absolute top-full left-1/2 flex gap-1 mt-1">
                    <div className="w-0.5 h-2 bg-gray-400 animate-pulse delay-100"></div>
                    <div className="w-0.5 h-3 bg-gray-400 animate-pulse"></div>
                    <div className="w-0.5 h-2 bg-gray-400 animate-pulse delay-200"></div>
                </div>
            </div>
        )
    };

    if (code === 0) return iconMap.sun; // Clear
    if (code >= 1 && code <= 3) return iconMap.cloud; // Cloudy
    if (code >= 51 && code <= 67) return iconMap.rain; // Rain/Drizzle
    if (code >= 80 && code <= 82) return iconMap.rain; // Showers
    return iconMap.cloud; // Default
};

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState('Checking Location...');

    useEffect(() => {
        const fetchWeather = (lat, lon) => {
             fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                .then(res => res.json())
                .then(data => setWeather(data.current_weather))
                .catch(() => setWeather({ temperature: 'N/A', weathercode: -1 }));
        };
        
        const fetchLocation = (lat, lon) => {
             fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
                .then(res => res.json())
                .then(data => setLocation(data.city || 'Unknown Location'))
                .catch(() => setLocation('Unknown Location'));
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude);
                    fetchLocation(latitude, longitude);
                },
                () => { // Geolocation failed
                    setLocation('Permission Denied');
                    setWeather({ temperature: '--', weathercode: -1 });
                }
            );
        } else {
            setLocation('Geolocation not supported');
        }
    }, []);

    return (
        <motion.div 
            className="text-center md:text-left relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <div className="flex items-center justify-center md:justify-start gap-4">
                {weather ? <WeatherIcon code={weather.weathercode} /> : <div className="w-10 h-8"></div>}
                <div>
                    <p 
                        className="font-mono text-5xl font-bold text-red-500"
                        style={{textShadow: '0 0 10px rgba(220, 38, 38, 0.5)'}}
                    >
                        {weather ? `${Math.round(weather.temperature)}°C` : '...'}
                    </p>
                    <p className="font-mono text-xs text-gray-400 tracking-widest">{location}</p>
                </div>
            </div>
        </motion.div>
    );
};

const BatteryWidget = () => {
    const [batteryInfo, setBatteryInfo] = useState({ level: 100, charging: false });

    useEffect(() => {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const updateBatteryStatus = () => {
                    setBatteryInfo({
                        level: Math.round(battery.level * 100),
                        charging: battery.charging
                    });
                };
                updateBatteryStatus();
                battery.addEventListener('chargingchange', updateBatteryStatus);
                battery.addEventListener('levelchange', updateBatteryStatus);
                return () => {
                    battery.removeEventListener('chargingchange', updateBatteryStatus);
                    battery.removeEventListener('levelchange', updateBatteryStatus);
                };
            });
        }
    }, []);

    return (
        <motion.div
            className="text-center md:text-left font-mono"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <div className="flex items-center justify-center md:justify-start gap-3">
                <p className="text-sm text-gray-400">BATTERY:</p>
                <p className="text-lg font-bold text-red-500">{batteryInfo.level}%</p>
                {batteryInfo.charging && (
                    <motion.p 
                        className="text-sm font-bold text-red-500"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        ⚡ CHARGING
                    </motion.p>
                )}
            </div>
            <div className="w-full max-w-xs mx-auto md:mx-0 h-1 bg-gray-700 mt-2 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${batteryInfo.level}%` }}></div>
            </div>
        </motion.div>
    );
};

const NetworkWidget = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [ping, setPing] = useState(null);

    useEffect(() => {
        const setOnline = () => setIsOnline(true);
        const setOffline = () => setIsOnline(false);

        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);

        const checkPing = async () => {
            const startTime = Date.now();
            try {
                await fetch(`https://www.google.com/favicon.ico?t=${Date.now()}`, { mode: 'no-cors', cache: 'no-cache' });
                const endTime = Date.now();
                setPing(endTime - startTime);
            } catch (e) {
                setPing(null);
            }
        };

        if (isOnline) {
            checkPing();
            const interval = setInterval(checkPing, 10000);
            return () => {
                clearInterval(interval);
                window.removeEventListener('online', setOnline);
                window.removeEventListener('offline', setOffline);
            };
        }
        
        return () => {
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
        };
    }, [isOnline]);

    return (
        <motion.div
            className="font-mono text-sm text-center md:text-left"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
        >
            <p>
                <span className="text-red-500">&gt; </span>
                <span className="text-gray-400">NETWORK: </span>
                {isOnline ? (
                    <motion.span 
                        className="font-bold text-red-500"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        ONLINE {ping !== null && `(${ping}ms)`}
                    </motion.span>
                ) : (
                    <span className="font-bold text-gray-600">OFFLINE</span>
                )}
            </p>
        </motion.div>
    );
};

const localQuotes = [
    { content: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { content: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { content: "First, solve the problem. Then, write the code.", author: "John Johnson" }
];

const Quote = ({ refreshKey }) => {
  const [quote, setQuote] = useState(() => localQuotes[Math.floor(Math.random() * localQuotes.length)]);

  useEffect(() => {
    const fetchQuote = () => {
        fetch(`https://api.quotable.io/random?tags=technology|wisdom|motivational|coding&_=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                if (data.content) setQuote(data);
            })
            .catch(() => { /* Fails silently, keeping the local quote */ });
    };
    fetchQuote();
  }, [refreshKey]);

  return (
    <div className="text-center md:text-left font-mono text-sm relative pt-1">
        <AnimatePresence mode="wait">
            <motion.div
                key={quote.content}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <p className="text-gray-300 italic text-xs">"{quote.content}"</p>
                <cite className="block text-right mt-1 text-xs text-gray-500">— {quote.author}</cite>
            </motion.div>
        </AnimatePresence>
    </div>
  );
};

const ScrollingLinesBackground = () => (
  <>
    <style>{`
      @keyframes scrollLines {
        0% { background-position: 0 0; }
        100% { background-position: 0 -100vh; }
      }
      .scrolling-lines-bg {
        background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent);
        background-size: 60px 60px;
        animation: scrollLines 20s linear infinite;
        opacity: 0.5;
      }
    `}</style>
    <div className="fixed inset-0 -z-10 scrolling-lines-bg pointer-events-none"></div>
  </>
);

const SystemLogStream = () => {
  const logLines = [
    "INITIATING BOOT SEQUENCE...",
    "KERNEL_VM_MAP: 0xffffff8000200000-0xffffff8372bf8000",
    "SYSTEM CHECK: ALL MODULES RESPONDING",
    "LOADING CORE DRIVERS... [OK]",
    "MOUNTING ROOT FILE SYSTEM... [OK]",
    "NETWORK INTERFACE eth0... [ONLINE]",
    "AUTH_SERVICE: AWAITING USER INPUT",
    "SECURE_LAYER_ENCRYPTION... [ACTIVE]",
    "UI_RENDERER: INITIALIZED",
    "SYSTEM READY.",
  ];

  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine(prev => (prev + 1) % logLines.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [logLines.length]);

  return (
    <div className="hidden md:block fixed bottom-4 right-4 z-20 w-80 h-24 p-3 bg-black/50 border border-border-color rounded-lg font-mono text-xs text-gray-400 overflow-hidden">
      <AnimatePresence>
        <motion.p
          key={currentLine}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="whitespace-nowrap"
        >
          <span className="text-red-500">&gt; </span>{logLines[currentLine]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

const StatusIndicator = () => (
    <div className="absolute top-5 left-5 flex items-center gap-2 font-mono text-xs text-red-500">
        <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </span>
        LIVE
    </div>
);

// --- The Main Password Screen Component ---

const PasswordScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isDeniedModalOpen, setIsDeniedModalOpen] = useState(false);
  const mainPanelRef = useRef(null);
  const [quoteRefreshKey, setQuoteRefreshKey] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(password);
    if (success) {
        setQuoteRefreshKey(prevKey => prevKey + 1);
    } else {
        setIsDeniedModalOpen(true);
        setPassword('');
    }
  };
  
  const handleMouseMove = (e) => {
      if (!mainPanelRef.current) return;
      const rect = mainPanelRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mainPanelRef.current.style.setProperty('--mouse-x', `${x}px`);
      mainPanelRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <>
      <style>{`
        .grid-glow::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle 300px at var(--mouse-x) var(--mouse-y), rgba(220, 38, 38, 0.1), transparent 80%);
          opacity: 0;
          transition: opacity 0.3s ease-out;
          border-radius: 1rem;
          pointer-events: none;
        }
        .grid-glow:hover::before {
          opacity: 1;
        }
      `}</style>
      <ScrollingLinesBackground />
      <SystemLogStream />
      <AccessDeniedModal isOpen={isDeniedModalOpen} onClose={() => setIsDeniedModalOpen(false)} />
      
      <div className="flex items-center justify-center min-h-screen bg-black text-white p-4 md:p-8 relative">
        <motion.div
          ref={mainPanelRef}
          onMouseMove={handleMouseMove}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-surface-color/80 backdrop-blur-sm border border-border-color rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl shadow-red-500/10 relative grid-glow"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatusIndicator/>
          <motion.div
            className="flex flex-col justify-between space-y-6"
            variants={itemVariants}
          >
            <Clock />
            <Calendar />
            <WeatherWidget />
            <BatteryWidget />
            <NetworkWidget />
            <Quote refreshKey={quoteRefreshKey} />
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center bg-black/50 p-8 rounded-xl border border-border-color"
            variants={itemVariants}
          >
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
                  className="w-full bg-transparent border-b-2 border-gray-600 p-3 text-center font-mono text-white placeholder-gray-500 text-lg focus:outline-none focus:border-red-500 focus:shadow-[0_2px_15px_rgba(255,0,0,0.3)] transition-all duration-300"
                  autoFocus
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full border border-red-500 text-red-500 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out font-semibold tracking-wider group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-red-500 transition-transform duration-300 ease-out translate-x-full group-hover:translate-x-0"></span>
                <span className="relative text-red-500 group-hover:text-black transition-colors duration-300">UNLOCK</span>
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default PasswordScreen;

