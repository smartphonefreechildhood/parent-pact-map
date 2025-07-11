import classNames from "classnames";

interface PillProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

function Pill({ children, variant = "primary" }: PillProps) {
  const pillClass = classNames("text-xs rounded-full px-2 py-1 flex flex-row", {
    "bg-primary text-on-primary": variant === "primary",
    "bg-inherit border border-white/75 text-white/75": variant === "secondary",
  });
  return <span className={pillClass}>{children}</span>;
}

export default Pill;
