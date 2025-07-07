import classNames from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant: "primary" | "secondary" | "tertiary";
  type: "button" | "submit" | "reset";
}

function Button({ children, onClick, variant, type }: ButtonProps) {
  const buttonClass = classNames(
    "px-4 py-2 border-none rounded-sm cursor-pointer transition-colors text-base",
    variant === "primary" && "bg-primary text-white hover:bg-primary-hover",
    variant === "secondary" && "bg-secondary text-white",
    variant === "tertiary" &&
      "bg-gray-200 text-primary border border-primary hover:bg-primary !hover:text-white"
  );

  return (
    <button type={type} onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
}

export default Button;
