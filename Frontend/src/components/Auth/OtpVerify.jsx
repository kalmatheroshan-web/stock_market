import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OtpInput from 'react-otp-input';
import { Loader2 } from 'lucide-react';
import { resendOtp, verifyOtp } from '../../services/auth';

const OTP_EXPIRY_KEY = 'otp_timer_expiry';
const OTP_DURATION = 59; // seconds

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user) || {};
  const email = location.state?.email || user?.email;

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  // Fade-in animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Initialize timer from localStorage on mount
  useEffect(() => {
    const storedExpiry = localStorage.getItem(OTP_EXPIRY_KEY);
    if (storedExpiry) {
      const expiry = parseInt(storedExpiry, 10);
      const now = Date.now();
      const remaining = Math.floor((expiry - now) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
        setCanResend(false);
        return;
      } else {
        localStorage.removeItem(OTP_EXPIRY_KEY);
        setTimer(0);
        setCanResend(true);
        setOtp(''); // Clear OTP on expiry
        return;
      }
    }
    // No stored expiry → start a fresh timer and send OTP
    const newExpiry = Date.now() + OTP_DURATION * 1000;
    (async () => {
      try {
        await resendOtp({ email });
        localStorage.setItem(OTP_EXPIRY_KEY, String(newExpiry));
        setTimer(OTP_DURATION);
        setCanResend(false);
      } catch (err) {
        setError('Failed to send OTP. Please try again.');
        setCanResend(true);
      }
    })();
  }, [email]);

  // Countdown effect
  const timerInterval = useRef(null);
  useEffect(() => {
    if (timer > 0) {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => {
          const newVal = prev - 1;
          if (newVal === 0) {
            // Timer expired → enable resend, clear storage and OTP
            localStorage.removeItem(OTP_EXPIRY_KEY);
            setCanResend(true);
            setOtp(''); // Clear OTP when expired
          }
          return newVal;
        });
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
    }
    return () => clearInterval(timerInterval.current);
  }, [timer]);

  // Auto-verify when OTP is complete (only if timer > 0)
  useEffect(() => {
    if (otp.length === 6 && timer > 0) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the full 6‑digit OTP');
      return;
    }
    if (timer === 0) {
      setError('OTP has expired. Please request a new one.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await dispatch(verifyOtp({ otp, ...location.state }, navigate));
      setSuccess('Verification successful!');
      localStorage.removeItem(OTP_EXPIRY_KEY);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await resendOtp({ email });
      setSuccess('A new OTP has been sent to your email.');
      const newExpiry = Date.now() + OTP_DURATION * 1000;
      localStorage.setItem(OTP_EXPIRY_KEY, String(newExpiry));
      setTimer(OTP_DURATION);
      setCanResend(false);
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0807] via-[#1a1410] to-[#0d0b0a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div
        className={`max-w-md w-full relative z-10 transform transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
      >
        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1410]/80 via-[#0d0b0a]/90 to-[#0a0807]/95 backdrop-blur-2xl border border-orange-500/20 shadow-[0_0_80px_rgba(255,120,0,0.05)]">
          <h2 className="text-2xl font-bold text-center text-orange-200/90 mb-2">Verify Your Email</h2>
          <p className="text-center text-orange-200/40 text-sm mb-6">
            Enter the 6‑digit code sent to {email}
          </p>

          {/* OTP Input – disabled when timer is 0 */}
          <div className="flex justify-center mb-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              separator={<span className="mx-2 text-orange-500/30">•</span>}
              disabled={timer === 0} // 👈 Disable input when expired
              renderInput={(props) => (
                <input
                  {...props}
                  style={{
                    width: '3rem',
                    height: '3.5rem',
                    fontSize: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '2px solid rgba(255, 140, 0, 0.2)',
                    backgroundColor: timer === 0 ? 'rgba(40,30,25,0.5)' : 'rgba(20,15,12,0.7)',
                    color: timer === 0 ? '#666' : 'white',
                    cursor: timer === 0 ? 'not-allowed' : 'text',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  className={`focus:border-orange-500 md:m-2 mx-1 focus:shadow-[0_0_20px_rgba(255,140,0,0.15)] transition-all duration-300 ${timer === 0 ? 'opacity-60' : ''
                    }`}
                  onFocus={(e) => {
                    if (timer === 0) return;
                    e.target.style.borderColor = '#ff8c00';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    if (timer === 0) return;
                    e.target.style.borderColor = 'rgba(255, 140, 0, 0.2)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  aria-label={`OTP digit ${props.index + 1}`}
                  disabled={timer === 0} // also set on individual input for safety
                />
              )}
              shouldAutoFocus={timer > 0}
            />
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-2 rounded-md mb-4 text-sm animate-slideDown">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/30 border border-green-500/30 text-green-200 px-4 py-2 rounded-md mb-4 text-sm animate-slideDown">
              {success}
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6 || timer === 0}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-[#0d0b0a] font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying…</span>
              </>
            ) : (
              'Verify'
            )}
          </button>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-orange-200/40 text-sm">
              Didn't receive the code?{' '}
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-orange-400 hover:text-orange-300 font-medium transition disabled:opacity-50"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-orange-500/40">Resend in {timer}s</span>
              )}
            </p>
          </div>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-orange-400/40 hover:text-orange-400 text-sm transition"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        @media (max-width: 480px) {
          .otp-input {
            width: 2.5rem !important;
            height: 3rem !important;
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OtpVerify;