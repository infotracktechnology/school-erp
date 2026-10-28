import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { School, Lock, User, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useErp } from '../context/ErpContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useErp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Destination redirect path if redirected by ProtectedRoute
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both your Username / Admission Number and Password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const user = await loginUser(username.trim(), password.trim());
      
      // Intelligent Role-based Redirection
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else {
        if (user.role === 'student') {
          // Student lands directly on their dedicated Student Dashboard / Portal
          navigate('/dashboard', { replace: true });
        } else if (user.role === 'principal') {
          // Principal lands on Campus Dashboard
          navigate('/dashboard', { replace: true });
        } else {
          // Super Admin lands on Central Dashboard
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background glowing ambient light effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand / Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-xl shadow-indigo-950/50 mb-4 border border-white/20 p-2">
            <img src="/assets/logo.png" alt="EduCampus ERP Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            EduCampus ERP
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Integrated School & Student Information Management
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign In to Your Account</h2>
            <p className="text-xs text-slate-500 mt-1">
              Admins, Principals & Students can log in using their credentials.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-start space-x-2 animate-shake">
              <span className="shrink-0 font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Admission No */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Username / Email / Admission No
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin@campuseye.com or ADM-2025-017"
                  required
                  autoFocus
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Students: Default is your Admission No
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Role Access Information */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-semibold text-slate-700">Supported Role Access:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-medium text-slate-600">
              <div className="bg-slate-50 border border-slate-200/70 p-1.5 rounded-lg">
                <span className="block font-bold text-indigo-700">Super Admin</span>
                <span>Full System</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/70 p-1.5 rounded-lg">
                <span className="block font-bold text-teal-700">Principal</span>
                <span>Campus Scope</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/70 p-1.5 rounded-lg">
                <span className="block font-bold text-sky-700">Student</span>
                <span>Portal & Feed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} EduCampus ERP. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
