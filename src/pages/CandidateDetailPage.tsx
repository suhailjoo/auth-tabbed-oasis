
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Clipboard, MessageSquare, BarChart2, User, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidateQuery, Candidate } from "@/hooks/useCandidateQuery";
import { useUpdateCandidateNotesMutation } from "@/hooks/useUpdateCandidateNotesMutation";
import { useAiResultsQuery } from "@/hooks/useAiResultsQuery";

const CandidateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("resume");
  const [notes, setNotes] = useState("");
  
  const { data: candidate, isLoading, error } = useCandidateQuery(id || "");
  const { data: aiResults, isLoading: isLoadingAi } = useAiResultsQuery(id || "");
  const updateNotesMutation = useUpdateCandidateNotesMutation();
  
  // Set notes when candidate data is loaded
  React.useEffect(() => {
    if (candidate?.notes) {
      setNotes(candidate.notes);
    }
  }, [candidate?.notes]);

  const handleBackClick = () => {
    if (candidate?.job_id) {
      navigate(`/jobs/${candidate.job_id}/pipeline`);
    } else {
      navigate(`/candidates`);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleNotesSave = () => {
    if (!id) return;
    updateNotesMutation.mutate({ candidateId: id, notes });
  };

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <BarChart2 className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-primary">Candidate Not Found</h1>
        <p className="text-muted-foreground">The candidate you're looking for doesn't exist or you don't have access to it.</p>
        <Button onClick={() => navigate('/candidates')}>Back to Candidates</Button>
      </div>
    );
  }

  // Extract initials for avatar
  const initials = candidate?.name
    ? candidate.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : "UC";

  const isPdf = candidate?.resume_url?.toLowerCase().endsWith('.pdf');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 bg-primary/10 border-2 border-primary/20">
            <AvatarFallback className="text-primary font-medium text-xl">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : (
                initials
              )}
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
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                candidate?.name || "Unnamed Candidate"
              )}
            </h1>
            <div className="flex items-center mt-1 gap-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </>
              ) : (
                <>
                  <Badge variant="outline" className="bg-primary/5 text-primary/80">
                    {candidate?.job_title || "No Job Title"}
                  </Badge>
                  <Badge variant="outline" className="capitalize bg-secondary/10 text-secondary/80">
                    {candidate?.stage || "No Stage"}
                  </Badge>
                </>
              )}
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
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : !candidate?.resume_url ? (
                <div className="bg-accent/10 p-8 rounded-md text-center">
                  <FileText className="h-16 w-16 text-primary/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium mb-2">No résumé available</p>
                  <p className="text-sm text-muted-foreground/80">Upload a résumé to view its content</p>
                  <Button className="mt-4" size="sm">
                    Upload Résumé
                  </Button>
                </div>
              ) : isPdf ? (
                <iframe 
                  src={candidate.resume_url} 
                  className="w-full h-[600px] border rounded-md"
                  title={`${candidate.name || 'Candidate'}'s Resume`}
                />
              ) : (
                <div className="bg-accent/10 p-8 rounded-md text-center">
                  <FileDown className="h-16 w-16 text-primary/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium mb-2">Resume is available for download</p>
                  <Button 
                    className="mt-4" 
                    size="sm" 
                    onClick={() => window.open(candidate.resume_url, '_blank')}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              )}
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
            <CardHeader className="border-b bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary/70" />
                <span>Notes</span>
              </CardTitle>
              <Button 
                onClick={handleNotesSave} 
                size="sm" 
                disabled={updateNotesMutation.isPending || isLoading}
              >
                {updateNotesMutation.isPending ? "Saving..." : "Save Notes"}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <Textarea 
                  value={notes} 
                  onChange={handleNotesChange}
                  placeholder="Add notes about this candidate..."
                  className="min-h-[200px] resize-y"
                />
              )}
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
              {isLoadingAi || isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : !aiResults?.roleFitScore && !aiResults?.autoTags && !aiResults?.interviewSummary ? (
                <div className="bg-accent/10 p-8 rounded-md text-center">
                  <BarChart2 className="h-16 w-16 text-primary/40 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium mb-2">No AI analysis available</p>
                  <p className="text-sm text-muted-foreground/80">Generate an AI analysis to see insights</p>
                  <Button className="mt-4" size="sm">
                    Generate Analysis
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {aiResults?.roleFitScore && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">Role Fit</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-primary/5 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Fit Score</div>
                          <div className="text-2xl font-bold text-primary">
                            {aiResults.roleFitScore.fit_score || "N/A"}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="text-sm text-muted-foreground mb-1">Verdict</div>
                          <div className="font-medium">
                            {aiResults.roleFitScore.verdict || "No verdict available"}
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground mb-1">Justification</div>
                          <div className="text-sm">
                            {aiResults.roleFitScore.justification || "No justification available"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {aiResults?.autoTags && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">Skills & Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {aiResults.autoTags.tags && Array.isArray(aiResults.autoTags.tags) ? (
                          aiResults.autoTags.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="bg-secondary/10">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <div className="text-muted-foreground text-sm">No tags available</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {aiResults?.interviewSummary && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">Interview Summary</h3>
                      <p className="text-sm">
                        {aiResults.interviewSummary.summary || "No interview summary available"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateDetailPage;
