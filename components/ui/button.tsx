interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      {...props}
    >
      {children}
    </button>
  );
};
