import { useState, useEffect } from 'react';
import { Heart, Sparkles, Lock, Unlock, Mail, Home, MailOpen, UserPlus, LogIn, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

type User = {
  username: string;
  password: string;
};

export default function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [users, setUsers] = useState<User[]>(() => {
    // Load users from localStorage on mount
    const savedUsers = localStorage.getItem('heartAccessUsers');
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch (e) {
        return [{ username: 'bubby', password: 'iloveyou' }];
      }
    }
    return [{ username: 'bubby', password: 'iloveyou' }];
  });
  const [accessGranted, setAccessGranted] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [specialAccessGranted, setSpecialAccessGranted] = useState(false);
  const [showSpecialQuestion, setShowSpecialQuestion] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [answer, setAnswer] = useState<'granted' | 'denied' | null>(null);
  const [currentView, setCurrentView] = useState<'message' | 'home'>('home');
  const [messageRevealed, setMessageRevealed] = useState(false);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('heartAccessUsers', JSON.stringify(users));
  }, [users]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid username or password. Try again! 💕');
      setPassword('');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setRegisterSuccess('');

    if (password !== confirmPassword) {
      setLoginError('Passwords do not match! 💔');
      return;
    }

    if (password.length < 6) {
      setLoginError('Password must be at least 6 characters! 🔒');
      return;
    }

    const existingUser = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      setLoginError('Username already exists! Try another one 💕');
      return;
    }

    setUsers([...users, { username, password }]);
    setRegisterSuccess('Account created successfully! Please login. 💖');
    setTimeout(() => {
      setAuthMode('login');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRegisterSuccess('');
    }, 2000);
  };

  const handleRequestAccess = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setAccessGranted(true);
      setIsRequesting(false);
    }, 2000);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ec4899', '#f43f5e', '#fb7185', '#fda4af'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ec4899', '#f43f5e', '#fb7185', '#fda4af'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleAnswer = (choice: 'granted' | 'denied') => {
    setAnswer(choice);
    setShowReaction(true);
    if (choice === 'granted') {
      triggerConfetti();
      setTimeout(() => {
        setSpecialAccessGranted(true);
      }, 3000);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccessGranted(false);
    setSpecialAccessGranted(false);
    setShowSpecialQuestion(false);
    setShowReaction(false);
    setAnswer(null);
    setCurrentView('home');
    setMessageRevealed(false);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 p-4 overflow-auto min-h-screen">
        {/* Cute floating hearts decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <Heart className="absolute top-10 left-10 w-8 h-8 text-pink-300 opacity-40 animate-bounce" fill="#fbcfe8" />
          <Heart className="absolute top-20 right-20 w-6 h-6 text-rose-300 opacity-30 animate-pulse" fill="#fda4af" />
          <Heart className="absolute bottom-20 left-20 w-10 h-10 text-pink-200 opacity-20 animate-pulse" fill="#fbcfe8" style={{ animationDelay: '0.5s' }} />
          <Heart className="absolute bottom-32 right-32 w-7 h-7 text-rose-200 opacity-25 animate-bounce" fill="#fda4af" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute top-1/3 left-1/4 w-6 h-6 text-pink-300 opacity-30 animate-spin" style={{ animationDuration: '3s' }} />
          <Sparkles className="absolute bottom-1/3 right-1/4 w-5 h-5 text-rose-300 opacity-20 animate-spin" style={{ animationDuration: '4s' }} />

          {/* Additional floating decorations */}
          <div className="absolute top-1/4 right-1/3 w-12 h-12 bg-pink-200 opacity-20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-rose-200 opacity-20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-md w-full relative z-10 border-4 border-pink-100">
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-pink-200 to-transparent opacity-30 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-rose-200 to-transparent opacity-30 rounded-br-3xl" />

          <div className="text-center mb-6 sm:mb-8 relative">
            <div className="flex justify-center mb-4 relative">
              <div className="relative">
                <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-pink-600 animate-pulse" fill="#ec4899" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-pink-400 animate-bounce" />
                <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-rose-400 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 mb-2 font-bold">
              Heart Access
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {authMode === 'login' ? '✨ Login to unlock something special ✨' : '💕 Create your account 💕'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-6 bg-gradient-to-r from-pink-50 to-rose-50 p-1.5 rounded-2xl shadow-inner">
            <button
              onClick={() => {
                setAuthMode('login');
                setLoginError('');
                setRegisterSuccess('');
                setPassword('');
                setConfirmPassword('');
              }}
              className={`flex-1 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-medium ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg transform scale-105'
                  : 'text-pink-700 hover:bg-white/50'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setLoginError('');
                setRegisterSuccess('');
                setPassword('');
                setConfirmPassword('');
              }}
              className={`flex-1 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-medium ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg transform scale-105'
                  : 'text-pink-700 hover:bg-white/50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Register
            </button>
          </div>

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span>👤</span> Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all bg-white/50"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span>🔒</span> Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all bg-white/50"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-700 text-center text-sm animate-shake flex items-center justify-center gap-2">
                  <span>❌</span> {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill="white" />
                Login
              </button>

              <div className="mt-4 pt-4 border-t border-pink-100">
                <p className="text-center text-xs sm:text-sm text-gray-500 bg-pink-50 rounded-lg p-3 flex items-center justify-center gap-2 flex-wrap">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
                  <span>Hint: Default username is "bubby" 💕</span>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="relative">
                <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span>👤</span> Username
                </label>
                <input
                  type="text"
                  id="reg-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all bg-white/50"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="relative">
                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span>🔒</span> Password
                </label>
                <input
                  type="password"
                  id="reg-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all bg-white/50"
                  placeholder="Create a password (min 6 chars)"
                  required
                />
              </div>

              <div className="relative">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span>✅</span> Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all bg-white/50"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-700 text-center text-sm animate-shake flex items-center justify-center gap-2">
                  <span>❌</span> {loginError}
                </div>
              )}

              {registerSuccess && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 text-green-700 text-center text-sm animate-fadeIn flex items-center justify-center gap-2">
                  <span>✨</span> {registerSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                Create Account
              </button>

              <div className="mt-4 pt-4 border-t border-pink-100">
                <p className="text-center text-xs sm:text-sm text-gray-500 bg-pink-50 rounded-lg p-3">
                  💡 Your account will be saved for future logins!
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (!accessGranted) {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 p-4 relative">
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 px-4 py-2 text-sm bg-white/80 text-gray-700 rounded-full hover:bg-white transition-all shadow-md flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>

        <div className="text-center px-4 sm:px-6 max-w-md w-full">
          <div className="relative inline-block mb-6 sm:mb-8">
            <Heart
              className={`w-28 h-28 sm:w-32 sm:h-32 ${isRequesting ? 'animate-pulse' : ''}`}
              fill={isRequesting ? "#ec4899" : "none"}
              stroke="#ec4899"
              strokeWidth={2}
            />
            {!isRequesting && (
              <Lock className="w-10 h-10 sm:w-12 sm:h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-600" />
            )}
            {isRequesting && (
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-spin" />
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl mb-4 text-pink-800">
            Access Request
          </h1>

          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-700">
            {isRequesting
              ? "Processing your request..."
              : "I'm requesting exclusive access to your heart"}
          </p>

          <button
            onClick={handleRequestAccess}
            disabled={isRequesting}
            className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isRequesting ? "Unlocking..." : "Grant Access"}
          </button>

          <p className="mt-6 text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            Click to unlock special moments
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          </p>
        </div>
      </div>
    );
  }

  if (accessGranted && !specialAccessGranted) {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 p-4 overflow-auto relative">
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 px-4 py-2 text-sm bg-white/80 text-gray-700 rounded-full hover:bg-white transition-all shadow-md flex items-center gap-2 z-20"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>

        <div className="text-center px-4 sm:px-6 max-w-2xl w-full">
          {!showSpecialQuestion ? (
            <div className="animate-fadeIn">
              <div className="relative inline-block mb-6 sm:mb-8">
                <Heart
                  className="w-32 h-32 sm:w-40 sm:h-40 animate-pulse"
                  fill="#ec4899"
                  stroke="#ec4899"
                  strokeWidth={2}
                />
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 absolute -top-4 -right-4 text-pink-600 animate-bounce" />
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 absolute -bottom-4 -left-4 text-rose-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl mb-6 text-pink-800 px-2">
                There's something important I'd like to ask you...
              </h1>

              <button
                onClick={() => setShowSpecialQuestion(true)}
                className="group relative px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-110 shadow-2xl"
              >
                <div className="flex items-center justify-center gap-3">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                  <span className="text-lg sm:text-xl font-medium">Reveal Question</span>
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <p className="mt-6 sm:mt-8 text-sm sm:text-base text-gray-700 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                Click to see my question
                <Sparkles className="w-4 h-4 text-pink-500" />
              </p>
            </div>
          ) : !showReaction ? (
            <div className="animate-fadeIn">
              <div className="relative inline-block mb-6 sm:mb-8">
                <Heart
                  className="w-32 h-32 sm:w-40 sm:h-40 animate-pulse"
                  fill="#ec4899"
                  stroke="#ec4899"
                  strokeWidth={2}
                />
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 absolute -top-4 -right-4 text-pink-600 animate-bounce" />
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 absolute -bottom-4 -left-4 text-rose-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl mb-6 sm:mb-8 text-pink-800 px-2">
                Can I have the Special Access to your HEART?
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch mt-8 sm:mt-12">
                <button
                  onClick={() => handleAnswer('granted')}
                  className="group relative px-6 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 sm:hover:scale-110 shadow-2xl flex-1 sm:flex-none sm:min-w-[200px]"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-xl sm:text-2xl">☐</span>
                    <span className="text-base sm:text-lg font-medium">REQUEST GRANTED</span>
                    <span className="text-2xl sm:text-3xl">💖</span>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <button
                  onClick={() => handleAnswer('denied')}
                  className="group relative px-6 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-2xl hover:from-gray-500 hover:to-gray-600 transition-all transform hover:scale-105 sm:hover:scale-110 shadow-2xl flex-1 sm:flex-none sm:min-w-[200px]"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-xl sm:text-2xl">☐</span>
                    <span className="text-base sm:text-lg font-medium">REQUEST DENIED</span>
                    <span className="text-2xl sm:text-3xl">🥺</span>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>

              <p className="mt-6 sm:mt-8 text-sm sm:text-lg text-gray-700 flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" fill="#ec4899" />
                Choose wisely...
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" fill="#ec4899" />
              </p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {answer === 'granted' ? (
                <div>
                  <div className="relative inline-block mb-6 sm:mb-8">
                    <Heart
                      className="w-40 h-40 sm:w-48 sm:h-48 animate-bounce"
                      fill="#ec4899"
                      stroke="#ec4899"
                      strokeWidth={2}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl sm:text-6xl animate-pulse">💖</span>
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-6xl mb-4 sm:mb-6 text-pink-800 animate-pulse px-2">
                    ☑ REQUEST GRANTED! 💖
                  </h1>

                  <div className="space-y-4 mb-6">
                    <p className="text-xl sm:text-2xl text-pink-700">
                      🎈 Yay! Access Granted with Love! 🎈
                    </p>
                    <div className="text-4xl sm:text-5xl animate-bounce">
                      🎊 🎉 🎊
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-gray-700 mb-6">
                    Opening the doors to my heart...
                  </p>

                  <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 animate-spin" />
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 animate-spin" style={{ animationDelay: '0.2s' }} />
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600 animate-spin" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative inline-block mb-6 sm:mb-8">
                    <Heart
                      className="w-40 h-40 sm:w-48 sm:h-48"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth={2}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl sm:text-6xl">🥺</span>
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-6xl mb-4 sm:mb-6 text-gray-700 px-2">
                    ☑ REQUEST DENIED 🥺
                  </h1>

                  <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-lg mx-auto mb-6 sm:mb-8">
                    <p className="text-xl sm:text-2xl text-gray-700 mb-4">
                      I'm deeply sorry...
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      I understand and respect your decision. Though my heart feels heavy right now, I want you to know that your happiness and comfort matter most to me. I hope that maybe, someday, you might reconsider... but until then, I'll be here, waiting with love and patience. 💔
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowReaction(false);
                      setShowSpecialQuestion(false);
                      setAnswer(null);
                    }}
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Maybe Reconsider? 💗
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="size-full bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 overflow-auto">
      <div className="min-h-full">
        {/* Navigation Bar */}
        <div className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10 border-b border-pink-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" fill="#ec4899" />
                <h2 className="text-lg sm:text-2xl text-pink-800">Heart Access</h2>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setMessageRevealed(false);
                  }}
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-full transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 ${
                    currentView === 'home'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                      : 'bg-white text-pink-700 hover:bg-pink-50 shadow'
                  }`}
                >
                  <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Home</span>
                </button>

                <button
                  onClick={() => setCurrentView('message')}
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-full transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 ${
                    currentView === 'message'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                      : 'bg-white text-pink-700 hover:bg-pink-50 shadow'
                  }`}
                >
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Message</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-full transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 bg-white text-gray-700 hover:bg-gray-100 shadow"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Home View */}
            {currentView === 'home' && (
              <div className="space-y-6 sm:space-y-8 animate-fadeIn">
                <div className="text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
                    <Unlock className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl text-pink-800">Access Granted</h1>
                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" fill="#ec4899" />
                  </div>
                  <p className="text-base sm:text-xl text-gray-700 px-4">
                    Welcome to a heart full of love and special moments
                  </p>
                </div>

                <div className="max-w-md mx-auto px-4">
                  <button
                    onClick={() => setCurrentView('message')}
                    className="group p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 w-full"
                  >
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <Mail className="w-16 h-16 sm:w-20 sm:h-20 text-pink-600 group-hover:scale-110 transition-transform" />
                        <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-pink-400 animate-bounce" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl text-pink-800">Read My Heart</h3>
                      <p className="text-sm sm:text-lg text-gray-600 text-center">
                        A special message filled with gratitude and love
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Message View */}
            {currentView === 'message' && (
              <div className="animate-fadeIn">
                {!messageRevealed ? (
                  <div className="max-w-md mx-auto text-center px-4">
                    <h2 className="text-2xl sm:text-3xl text-pink-800 mb-6 sm:mb-8">
                      You've got mail! 💌
                    </h2>

                    <button
                      onClick={() => setMessageRevealed(true)}
                      className="group relative mx-auto"
                    >
                      <div className="relative p-8 sm:p-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border-4 border-pink-200">
                        {/* Envelope design */}
                        <div className="relative">
                          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-white rounded-lg shadow-lg flex items-center justify-center transform group-hover:rotate-3 transition-transform">
                            <MailOpen className="w-16 h-16 sm:w-20 sm:h-20 text-pink-600 group-hover:scale-110 transition-transform" />
                          </div>
                          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-pink-500 animate-bounce" />
                          <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-rose-500 animate-pulse" />
                        </div>

                        <div className="mt-6 px-4">
                          <p className="text-base sm:text-lg text-pink-800 font-medium mb-2">
                            Click to open
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            A heartfelt message awaits you
                          </p>
                        </div>

                        <Heart className="absolute top-2 left-2 w-6 h-6 text-pink-400 opacity-50" fill="#fbcfe8" />
                        <Heart className="absolute bottom-2 right-2 w-5 h-5 text-rose-400 opacity-50" fill="#fda4af" />
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                      <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600 animate-pulse" fill="#ec4899" />
                      <h2 className="text-2xl sm:text-3xl text-pink-800 text-center">A Message From My Heart</h2>
                      <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600 animate-pulse" fill="#ec4899" />
                    </div>

                    <div className="prose prose-sm sm:prose-lg max-w-none text-gray-700 space-y-4 sm:space-y-6 leading-relaxed">
                      <p className="text-lg sm:text-xl text-pink-700">
                        Hello Bubby/Bae/Bi/Biiiii,
                      </p>

                      <p className="text-sm sm:text-base">
                        The amount of thoughts that have been going through my mind lately includes a lot of things, but one thought that has been constantly occupying the space in my heart is my gratitude towards you. It is something that I may not tell you often, but you mean a lot to me and your presence in my life means a lot. There is so much about you that I love, from the simple things to the big things. You've made my life so warm and joyful that I feel very blessed that I've met you not by choice, instead by chance. You have given me so many reasons to keep going forward that I feel lucky just to have you around. All you have done for me reminds me a lot and surely to be cherished.
                      </p>

                      <blockquote className="border-l-4 border-pink-400 pl-3 sm:pl-4 italic text-pink-800 bg-pink-50 py-2 sm:py-3 rounded-r-lg text-sm sm:text-base">
                        "Love bears all things, believes all things, hopes all things, endures all things." (1 Corinthians 13:6–7 ESV)
                      </blockquote>

                      <p className="text-sm sm:text-base">
                        Simply means that love will always be resilient and never stop working even when conditions get tough, love will not question itself; instead, it is all about remaining faithful, hopeful, and committed.
                      </p>

                      <p className="text-sm sm:text-base">
                        A love that is patient, compassionate, and able to hold on even when the going gets tough that's how important it is to me. And yes, I do feel like having you in my life is a blessing, since sharing my life with you has made it that much easier to live and enjoy. It is much easier for people to live their lives when they have someone else supporting them. This means that two individuals together will do things faster, motivate each other, and deal with difficulties that might seem insurmountable on their own.
                      </p>

                      <blockquote className="border-l-4 border-pink-400 pl-3 sm:pl-4 italic text-pink-800 bg-pink-50 py-2 sm:py-3 rounded-r-lg text-sm sm:text-base">
                        "Two are better than one, because they have a good reward for their toil." (Ecclesiastes 4:9)
                      </blockquote>

                      <p className="text-sm sm:text-base">
                        Being with you allows me to be myself without worrying about whether I'm good enough. It is rare that you provide me with the kind of serenity that allows me to be who I am. Love from God or love that mirrors God does away with fear. This fear is usually due to insecurity or a lack of confidence. In the absence of any fear, one can have a lot of self-confidence and courage.
                      </p>

                      <blockquote className="border-l-4 border-pink-400 pl-3 sm:pl-4 italic text-pink-800 bg-pink-50 py-2 sm:py-3 rounded-r-lg text-sm sm:text-base">
                        "Such love has no fear, because perfect love expels all fear" (1 John 4:18 NLT)
                      </blockquote>

                      <p className="text-sm sm:text-base">
                        Thank you for your patience, compassion, understanding, and decision to show up in my life. Thank you for making me feel safe, for putting a smile on my face, and for simply brightening my life just by being around. I can't thank you enough for the blessing you've been in my life. I'm extremely thankful that it is YOU 💛
                      </p>
                    </div>

                    <div className="mt-6 sm:mt-8 text-center">
                      <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                        <p className="text-sm sm:text-base text-pink-800">
                          With all my love
                        </p>
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}