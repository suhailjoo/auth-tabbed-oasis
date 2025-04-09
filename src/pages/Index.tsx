
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent/30 via-white to-primary/20 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-highlight-yellow/30 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-accent/30 blur-3xl"></div>
        <div className="absolute top-[60%] left-[10%] w-72 h-72 rounded-full bg-primary/30 blur-3xl"></div>
      </div>
      
      <div className="text-center max-w-2xl mx-auto z-10 animate-fade-in">
        <h1 className="text-6xl font-roboto font-bold mb-2 text-gray-800">
          hatch<span className="text-primary">.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto">
          The complete platform for modern hiring teams
        </p>
        <Button 
          asChild 
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-white font-semibold hover:scale-105 transition-all shadow-lg"
        >
          <Link to="/auth">
            Get Started
          </Link>
        </Button>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold mb-2">Streamline Hiring</h3>
            <p className="text-gray-600">Manage your entire recruitment pipeline from sourcing to onboarding.</p>
          </div>
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold mb-2">Collaborative Tools</h3>
            <p className="text-gray-600">Work seamlessly with your team to evaluate and track candidates.</p>
          </div>
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">Get intelligent recommendations and analytics for better decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
