
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const AuthPage = () => {
  return (
    <AuthLayout>
      <Card className="auth-card w-full border-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none rounded-2xl" />
        
        <CardHeader className="space-y-1 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-highlight-yellow" />
          <CardTitle className="text-2xl font-bold text-center text-gray-800" style={{animationDelay: '0.1s', animation: 'fade-in 0.5s forwards'}}>
            Welcome
          </CardTitle>
          <CardDescription className="text-center" style={{animationDelay: '0.2s', animation: 'fade-in 0.5s forwards'}}>
            Login or create an account to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary/30 p-1 rounded-lg">
              <TabsTrigger value="login" className="tabs-trigger rounded-md">Login</TabsTrigger>
              <TabsTrigger value="signup" className="tabs-trigger rounded-md">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-4 space-y-4" style={{animation: 'slide-in 0.3s ease-out forwards'}}>
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="signup" className="mt-4 space-y-4" style={{animation: 'slide-in 0.3s ease-out forwards'}}>
              <SignupForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 opacity-70 text-xs">
          <div className="text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default AuthPage;
