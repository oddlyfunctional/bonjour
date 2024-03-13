export const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-full justify-center md:p-6">
      <div className={`bg-white ${className ? " " + className : ""}`}>
        {children}
      </div>
    </div>
  );
};
