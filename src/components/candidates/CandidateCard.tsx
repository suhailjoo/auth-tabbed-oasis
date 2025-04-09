
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import { ChevronRight } from "lucide-react";
import { Candidate } from "@/hooks/useCandidatesQuery";

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

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <h3 className="font-medium text-base mb-1 text-primary">
          {displayName}
        </h3>
        <p className="text-xs text-muted-foreground">
          Added {uploadDate}
        </p>
      </CardContent>
      <CardFooter className="pt-0 justify-end">
        <Button variant="ghost" size="sm" className="text-xs">
          View Details
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
