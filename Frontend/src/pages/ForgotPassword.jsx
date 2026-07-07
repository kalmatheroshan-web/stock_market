import React, { useState } from "react";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/UI/Button";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Call your API here
    console.log(email);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0B0D] px-4 py-8">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-[#FF8C00]/10 blur-[150px]" />
      <div className="absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-[#22C55E]/5 blur-[180px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#303036] bg-[#1C1C20]/90 shadow-2xl backdrop-blur-xl">

        {/* Header */}
        <div className="border-b border-[#303036] bg-gradient-to-r from-[#141416] to-[#1C1C20] px-8 py-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF8C00]/10 ring-1 ring-[#FF8C00]/20">
            <ShieldCheck
              className="h-8 w-8 text-[#FF8C00]"
              strokeWidth={2.2}
            />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-[#F5F5F5]">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#A1A1AA]">
            Enter your registered email address and we'll send you
            a secure password reset link.
          </p>
        </div>

        {/* Form */}
        <div className="p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#A1A1AA]">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
                  size={18}
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-[#303036] bg-[#141416] py-4 pl-12 pr-4 text-[#F5F5F5] placeholder:text-[#6B7280] outline-none transition-all duration-300 focus:border-[#FF8C00] focus:ring-4 focus:ring-[#FF8C00]/20"
                />
              </div>
            </div>

            <Button
              title="Send Reset Link"
              type="submit"
            />
          </form>

          {/* Security Note */}
          <div className="mt-8 rounded-xl border border-[#303036] bg-[#141416] p-4">

            <p className="text-center text-sm leading-6 text-[#A1A1AA]">
              🔒 For your security, password reset links expire after
              <span className="font-semibold text-[#22C55E]">
                {" "}15 minutes
              </span>.
            </p>

          </div>

          {/* Back */}
          <div className="mt-8 text-center">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#FF8C00] transition hover:text-[#FFA726]"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;