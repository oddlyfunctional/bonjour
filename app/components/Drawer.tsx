import * as Icons from "@/app/components/Icons";

export const Drawer = ({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`absolute left-0 top-0 z-10 flex h-full w-full flex-col border-r bg-gray-200 transition-transform${open ? "" : " -translate-x-full"}`}
    >
      <div className="flex flex-row border-b bg-gray-800 p-4 text-white">
        <button onClick={onClose}>
          <Icons.ArrowLeft />
        </button>
        <div className="w-full text-center">
          <h2>{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
};
