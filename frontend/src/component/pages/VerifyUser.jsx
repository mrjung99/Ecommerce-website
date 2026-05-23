import { useEffect, useRef, useState } from "react";
import { X, Mail, ShieldCheck } from "lucide-react";
import { useVerifyOtpMutation } from "../../redux/features/user/userApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyUser = ({ isOpen, onClose, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();

  const inputsRef = useRef([]);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    try {
      const res = await verifyOtp({
        email,
        otp: finalOtp,
      }).unwrap();

      toast.success(res?.message);
      onClose();
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Verification failed.");
    }
  };

  const handleResendOtp = async () => {
    try {
      // call resend otp api here

      setCountdown(60);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-purple-500/30 blur-3xl" />

        {/* Content */}
        <div className="relative p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg">
            <ShieldCheck className="text-white" size={30} />
          </div>

          {/* Title */}
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Verify Account
          </h2>

          <p className="mt-2 text-center text-sm text-gray-300">
            Enter the 6-digit OTP sent to your email
          </p>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  className="h-14 w-14 rounded-2xl border border-white/10 bg-white/10 text-center text-2xl font-bold text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 px-4 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-400">
                Resend OTP in{" "}
                <span className="font-semibold text-white">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className="text-sm font-medium text-blue-400 transition hover:text-blue-300 cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyUser;
