import { Loader2 } from "lucide-react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-button";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-hover shadow-soft",
    secondary: "bg-surface-container text-text-primary hover:bg-surface-dim",
    outline: "border border-outline bg-transparent text-text-primary hover:bg-surface-container",
    ghost: "bg-transparent text-text-secondary hover:text-primary hover:bg-surface-container",
    danger: "bg-error text-white hover:bg-error/90"
  };

  const sizes = {
    sm: "py-1 px-3 text-xs",
    md: "py-2 px-6 text-sm",
    lg: "py-3 px-8 text-base",
    icon: "p-2"
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={combinedStyles}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
