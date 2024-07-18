import { ReactNode } from "react";

const ClerkLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-center items-center h-screen">{children}</div>
  );
};
export default ClerkLayout;
