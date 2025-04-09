
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Clipboard, MessageSquare, BarChart2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AuthLayout from "@/layouts/AuthLayout";

const CandidateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("resume");

  // Placeholder candidate data
  const candidate = {
    name: "Unnamed Candidate",
    email: "candidate@example.com",
    jobId: "placeholder-job-id",
    jobTitle: "Software Engineer",
    stage: "interview",
    createdAt: new Date().toISOString(),
  };

  const handleBackClick = () => {
    navigate(`/jobs/${candidate.jobId}/pipeline`);
  };

  // Extract initials for avatar
  const initials = candidate.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || "UC";

  return (
    <AuthLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 bg-primary/10 border-2 border-primary/20">
              <AvatarFallback className="text-primary font-medium text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button 
                variant="ghost" 
                className="pl-0 text-primary mb-1 -ml-2 hover:bg-primary/5" 
                onClick={handleBackClick}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pipeline
              </Button>
              <h1 className="text-2xl font-bold text-primary">
                {candidate.name}
              </h1>
              <div className="flex items-center mt-1 gap-3">
                <Badge variant="outline" className="bg-primary/5 text-primary/80">
                  {candidate.jobTitle}
                </Badge>
                <Badge variant="outline" className="capitalize bg-secondary/10 text-secondary/80">
                  {candidate.stage}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="text-sm">
              Send Email
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              Schedule Interview
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="resume" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full bg-background border border-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="resume" 
              className={`flex items-center gap-1.5 py-2 ${activeTab === "resume" ? "text-primary" : ""}`}
            >
              <FileText className="h-4 w-4" />
              <span>Résumé</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scorecards" 
              className={`flex items-center gap-1.5 py-2 ${activeTab === "scorecards" ? "text-primary" : ""}`}
            >
              <Clipboard className="h-4 w-4" />
              <span>Scorecards</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className={`flex items-center gap-1.5 py-2 ${activeTab === "notes" ? "text-primary" : ""}`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Notes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="fit" 
              className={`flex items-center gap-1.5 py-2 ${activeTab === "fit" ? "text-primary" : ""}`}
            >
              <BarChart2 className="h-4 w-4" />
              <span>Fit + Summary</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary/70" />
                  <span>Résumé</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-accent/10 p-8 rounded-md text-center">
                  <FileText className="h-16 w-16 text-primary/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium mb-2">Résumé content will appear here</p>
                  <p className="text-sm text-muted-foreground/80">Upload a résumé to view its content</p>
                  <Button className="mt-4" size="sm">
                    Upload Résumé
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scorecards" className="mt-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-primary/70" />
                  <span>Scorecards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-accent/10 p-8 rounded-md text-center">
                  <Clipboard className="h-16 w-16 text-primary/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium mb-2">Scorecard evaluations will appear here</p>
                  <p className="text-sm text-muted-foreground/80">Add a scorecard to evaluate this candidate</p>
                  <Button className="mt-4" size="sm">
                    Add Scorecard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary/70" />
                  <span>Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-accent/10 p-8 rounded-md text-center">
                  <MessageSquare className="h-16 w-16 text-primary/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium mb-2">Candidate notes will appear here</p>
                  <p className="text-sm text-muted-foreground/80">Add notes to track important information</p>
                  <Button className="mt-4" size="sm">
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fit" className="mt-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary/70" />
                  <span>Fit + Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-accent/10 p-8 rounded-md text-center">
                  <BarChart2 className="h-16 w-16 text-primary/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium mb-2">Candidate fit analysis and summary will appear here</p>
                  <p className="text-sm text-muted-foreground/80">AI-generated insights about candidate qualifications</p>
                  <Button className="mt-4" size="sm">
                    Generate Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthLayout>
  );
};

export default CandidateDetailPage;
