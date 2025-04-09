
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import { ChevronRight, User } from "lucide-react";
import { Candidate } from "@/hooks/useCandidatesQuery";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const displayName = candidate.name || "Unnamed Candidate";
  const uploadDate = formatDistance(
    new Date(candidate.created_at),
    new Date(),
    { addSuffix: true }
  );
  
  // Extract initials for avatar
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card className="mb-3 hover:shadow-md transition-all border-l-4 border-l-primary/60 hover:translate-y-[-2px]">
      <CardContent className="pt-4 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-8 w-8 bg-primary/10">
            <AvatarFallback className="text-primary font-medium text-xs">
              {initials || "UC"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-base text-primary leading-tight">
              {displayName}
            </h3>
            <p className="text-xs text-muted-foreground">
              Added {uploadDate}
            </p>
          </div>
        </div>
        
        {candidate.resume_url && (
          <Badge variant="outline" className="bg-accent/30 text-xs mt-1">
            Resume
          </Badge>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-3 justify-end">
        <Button variant="ghost" size="sm" className="text-xs hover:bg-primary/10 hover:text-primary">
          View Details
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
