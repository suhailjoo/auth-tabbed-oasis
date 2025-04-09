
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Clipboard, MessageSquare, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthLayout from "@/layouts/AuthLayout";

const CandidateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Placeholder candidate data
  const candidate = {
    name: "Unnamed Candidate",
    jobId: "placeholder-job-id"
  };

  const handleBackClick = () => {
    navigate(`/jobs/${candidate.jobId}/pipeline`);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <Button 
              variant="ghost" 
              className="pl-0 text-primary mb-2" 
              onClick={handleBackClick}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pipeline
            </Button>
            <h1 className="text-2xl font-bold text-primary">
              {candidate.name}
            </h1>
          </div>
        </div>

        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid grid-cols-4 w-full md:w-2/3 lg:w-1/2">
            <TabsTrigger value="resume" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Résumé</span>
            </TabsTrigger>
            <TabsTrigger value="scorecards" className="flex items-center gap-1">
              <Clipboard className="h-4 w-4" />
              <span>Scorecards</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Notes</span>
            </TabsTrigger>
            <TabsTrigger value="fit" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>Fit + Summary</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/10 p-6 rounded-md text-center">
                  <FileText className="h-12 w-12 text-primary/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">Résumé content will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scorecards" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scorecards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/10 p-6 rounded-md text-center">
                  <Clipboard className="h-12 w-12 text-primary/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">Scorecard evaluations will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/10 p-6 rounded-md text-center">
                  <MessageSquare className="h-12 w-12 text-primary/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">Candidate notes will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fit" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fit + Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/10 p-6 rounded-md text-center">
                  <BarChart className="h-12 w-12 text-primary/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">Candidate fit analysis and summary will appear here</p>
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
