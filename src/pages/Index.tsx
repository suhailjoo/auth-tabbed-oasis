
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Application</h1>
        <p className="text-xl text-gray-600 mb-8">
          Get started by logging in or creating a new account
        </p>
        <Button asChild size="lg">
          <Link to="/auth">
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
