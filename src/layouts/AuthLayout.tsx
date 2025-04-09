
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/30 via-white to-primary/20 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-highlight-yellow/30 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-accent/30 blur-3xl"></div>
        <div className="absolute top-[60%] left-[10%] w-72 h-72 rounded-full bg-primary/30 blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
