function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs text-gray-600 bg-gray-200 rounded-full px-2 py-1 flex flex-row">
      {children}
    </span>
  );
}

export default Pill;
