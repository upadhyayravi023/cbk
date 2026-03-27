import { useState } from 'react';
import { Lock, Smartphone, KeyRound, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminLogin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminLogin = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return setError('Please enter a valid mobile number.');
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.error || 'Failed to send OTP. Check the number.');
      }
    } catch (err) {
      setError('Connection failed. Check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return setError('Please enter the 6-digit OTP.');

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid or expired OTP.');
      }
    } catch (err) {
      setError('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <motion.div className="login-card card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-4">
          <div className="lock-icon-wrapper">
            <Lock size={32} color="white" />
          </div>
          <h2>Admin Portal</h2>
          <p className="text-light">
            {step === 1 ? 'Enter your registered mobile' : 'Verify the 6-digit code'}
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="error-alert">
            {error}
          </motion.div>
        )}

        <div className="auth-flow-container">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                onSubmit={handleSendOtp} 
                className="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="form-group">
                  <label>Mobile Number</label>
                  <div className="input-with-icon">
                    <Smartphone size={18} className="input-icon" />
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="e.g. 9100000000"
                      required 
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary login-btn" disabled={loading}>
                  {loading ? 'Sending...' : (
                    <span className="flex-center gap-2">Send OTP <ArrowRight size={18}/></span>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                onSubmit={handleVerifyOtp} 
                className="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="form-group">
                  <label>Enter OTP</label>
                  <div className="input-with-icon">
                    <KeyRound size={18} className="input-icon" />
                    <input 
                      type="text" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      placeholder="6-digit code"
                      maxLength={6}
                      required 
                    />
                  </div>
                  <p className="resend-hint">Check your server terminal for simulation OTP.</p>
                </div>
                <button type="submit" className="btn-primary login-btn" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
                <button 
                  type="button" 
                  className="btn-ghost-sm mt-3" 
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  <RefreshCw size={14}/> Change Number
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
