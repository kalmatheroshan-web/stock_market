import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import OtpInput from 'react-otp-input';
import axios from 'axios';
import { verifyEmail } from '../../Redux/authSlice';
import { Loader2 } from 'lucide-react'; // optional spinner icon

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get user from Redux
  const user = useSelector((state) => state.auth.user);
  const purpose = location.state?.purpose || 'verify_email';
  const email = location.state?.email || user?.email;

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  // Fade‑in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Purpose‑driven UI texts
  const getTexts = () => {
    switch (purpose) {
      case 'reset_password':
        return {
          title: 'Reset Your Password',
          description: 'Enter the 6‑digit code sent to your email to reset your password.',
          successMessage: 'Password reset verified! Redirecting…',
          redirectPath: '/reset-password',
          apiEndpoint: '/api/auth/verify-reset-otp',
          resendEndpoint: '/api/auth/reset-password-resend',
        };
      case 'verify_email':
      default:
        return {
          title: 'Verify Your Email',
          description: `We sent a 6‑digit code to ${email}`,
          successMessage: 'Email verified successfully!',
          redirectPath: '/dashboard',
          apiEndpoint: '/api/auth/verify-email',
          resendEndpoint: '/api/auth/resend-otp',
        };
    }
  };

  const texts = getTexts();
  const timerInterval = useRef(null);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(timerInterval.current);
    }
    return () => clearInterval(timerInterval.current);
  }, [timer]);

  // Auto‑verify when OTP is complete (6 digits)
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the full 6‑digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(texts.apiEndpoint, {
        email,
        otp,
        purpose,
      });

      setSuccess(texts.successMessage);

      if (purpose === 'verify_email') {
        dispatch(verifyEmail({ email }));
      }

      setTimeout(() => navigate(texts.redirectPath), 1500);
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
      await axios.post(texts.resendEndpoint, { email, purpose });
      setSuccess('A new OTP has been sent to your email.');
      setTimer(30);
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

      {/* Card with entrance animation */}
      <div
        className={`max-w-md w-full relative z-10 transform transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1410]/80 via-[#0d0b0a]/90 to-[#0a0807]/95 backdrop-blur-2xl border border-orange-500/20 shadow-[0_0_80px_rgba(255,120,0,0.05)]">

          <h2 className="text-2xl font-bold text-center text-orange-200/90 mb-2">{texts.title}</h2>
          <p className="text-center text-orange-200/40 text-sm mb-6">{texts.description}</p>

          {/* OTP Input */}
          <div className="flex justify-center mb-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              separator={<span className="mx-2 text-orange-500/30">•</span>}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{
                    width: '3rem',
                    height: '3.5rem',
                    fontSize: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '2px solid rgba(255, 140, 0, 0.2)',
                    backgroundColor: 'rgba(20, 15, 12, 0.7)',
                    color: 'white',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  className="focus:border-orange-500  md:m-2 mx-1 focus:shadow-[0_0_20px_rgba(255,140,0,0.15)] transition-all duration-300"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff8c00';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 140, 0, 0.2)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  aria-label={`OTP digit ${props.index + 1}`}
                />
              )}
              shouldAutoFocus
            />
          </div>

          {/* Animated Messages */}
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

          {/* Verify Button with loading spinner */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
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

      {/* CSS Animations */}
      <style>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        /* Responsive OTP inputs */
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