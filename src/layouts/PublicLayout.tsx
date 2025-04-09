
import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/30 via-white to-primary/20 p-4">
      {children}
    </div>
  );
};

export default PublicLayout;
