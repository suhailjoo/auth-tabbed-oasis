
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, Users, LogOut, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/state/useAuthStore";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const SidebarLogo = () => {
  const { state } = useSidebar();
  
  return (
    <div className="flex h-16 items-center px-4 justify-center">
      <h1 className="text-2xl font-bold text-sidebar-foreground">
        {state === "collapsed" ? (
          <>
            h<span className="text-[navy]">.</span>
          </>
        ) : (
          <>
            hatch<span className="text-primary">.</span>
          </>
        )}
      </h1>
    </div>
  );
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      navigate('/auth');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was an error signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: Briefcase,
    },
    {
      name: "Candidates",
      path: "/candidates",
      icon: Users,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="sidebar" collapsible="icon" side="left">
          <SidebarHeader>
            <SidebarLogo />
          </SidebarHeader>
          <SidebarContent className="bg-gradient-to-b from-primary to-primary/80">
            <ScrollArea className="h-full">
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={location.pathname === item.path}
                      tooltip={item.name}
                      asChild
                      className="transition-all hover:translate-x-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:text-center"
                    >
                      <Link to={item.path} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                        <item.icon className="text-white" />
                        <span className="text-white font-medium">
                          {item.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter className="bg-sidebar-accent/20 backdrop-blur-sm">
            <SidebarSeparator />
            <div className="p-2">
              <SidebarMenuButton
                onClick={handleSignOut}
                tooltip="Sign out"
                size="default"
                variant="outline"
                className="text-white bg-sidebar-accent hover:bg-sidebar-accent/80 hover:text-white group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </SidebarMenuButton>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 border-b bg-gradient-to-r from-accent/30 via-white to-accent/10 backdrop-blur">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger className="bg-white shadow-md hover:bg-accent/30" />
              <div className="ml-4 font-medium text-primary">
                {user?.email}
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSignOut}
                  className="md:hidden text-primary hover:bg-primary/10"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-white via-accent/5 to-white">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AuthLayout;
