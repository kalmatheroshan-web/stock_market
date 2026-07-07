import React from "react";

function Button({
  title,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        group
        relative cursor-pointer
        w-full
        overflow-hidden
        rounded-xl
        bg-gradient-to-r
        from-[#FF8C00]
        to-[#FFA726]
        py-4
        font-semibold
        text-[#0B0B0D]
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-[0_0_30px_rgba(255,140,0,.35)]
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    >
      <span className="relative z-10">{title}</span>

      <div className="absolute inset-0 translate-y-full bg-white/20 transition-all duration-300 group-hover:translate-y-0" />
    </button>
  );
}

export default Button;