
import React from "react";
import { Link } from "react-router-dom";
import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import { ChevronRight, User, GripVertical } from "lucide-react";
import { Candidate } from "@/hooks/useCandidatesQuery";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  isDragging?: boolean;
}

const CandidateCard = ({ candidate, isDragging = false }: CandidateCardProps) => {
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
    
  // Set up draggable
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: candidate.id,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  
  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "mb-3 hover:shadow-md transition-all border-l-4 border-l-primary/60 hover:translate-y-[-2px]",
        isDragging ? "opacity-50" : "",
        "relative group cursor-grab"
      )}
    >
      <div 
        className="absolute top-0 bottom-0 left-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      
      <CardContent className="pt-4 pb-2 pl-6">
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs hover:bg-primary/10 hover:text-primary" 
          asChild
        >
          <Link to={`/candidates/${candidate.id}`}>
            View Details
            <ChevronRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
