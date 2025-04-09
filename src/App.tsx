
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import JobsPage from "./pages/JobsPage";
import CandidatesPage from "./pages/CandidatesPage";
import NotFound from "./pages/NotFound";
import AuthProvider from "./components/auth/AuthProvider";
import AuthGuard from "./components/auth/AuthGuard";
import AuthLayout from "./layouts/AuthLayout";
import PublicLayout from "./layouts/PublicLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route 
              path="/auth" 
              element={
                <PublicLayout>
                  <AuthPage />
                </PublicLayout>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <AuthGuard>
                  <AuthLayout>
                    <DashboardPage />
                  </AuthLayout>
                </AuthGuard>
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <AuthGuard>
                  <AuthLayout>
                    <JobsPage />
                  </AuthLayout>
                </AuthGuard>
              } 
            />
            <Route 
              path="/candidates" 
              element={
                <AuthGuard>
                  <AuthLayout>
                    <CandidatesPage />
                  </AuthLayout>
                </AuthGuard>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
