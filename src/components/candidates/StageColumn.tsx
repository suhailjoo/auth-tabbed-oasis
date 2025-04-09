
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CandidateCard from "./CandidateCard";
import { Candidate } from "@/hooks/useCandidatesQuery";

interface StageColumnProps {
  title: string;
  candidates: Candidate[];
  count: number;
}

const stageBgColors = {
  applied: "bg-blue-50 border-blue-200",
  screening: "bg-purple-50 border-purple-200",
  interview: "bg-indigo-50 border-indigo-200",
  offer: "bg-green-50 border-green-200",
  hired: "bg-emerald-50 border-emerald-200",
  rejected: "bg-red-50 border-red-200",
};

const stageHeaderColors = {
  applied: "text-blue-700 border-blue-200 bg-blue-100/50",
  screening: "text-purple-700 border-purple-200 bg-purple-100/50",
  interview: "text-indigo-700 border-indigo-200 bg-indigo-100/50",
  offer: "text-green-700 border-green-200 bg-green-100/50",
  hired: "text-emerald-700 border-emerald-200 bg-emerald-100/50",
  rejected: "text-red-700 border-red-200 bg-red-100/50",
};

const stageIcons = {
  applied: "🔔",
  screening: "🔍",
  interview: "💼",
  offer: "📝",
  hired: "🎉",
  rejected: "❌",
};

const StageColumn = ({ title, candidates, count }: StageColumnProps) => {
  const stageKey = title.toLowerCase() as keyof typeof stageBgColors;
  const bgColorClass = stageBgColors[stageKey] || "bg-gray-50 border-gray-200";
  const headerColorClass = stageHeaderColors[stageKey] || "text-gray-700 border-gray-200 bg-gray-100/50";
  const stageIcon = stageIcons[stageKey] || "📋";

  return (
    <Card className={`h-full flex flex-col shadow-md ${bgColorClass}`}>
      <CardHeader className={`pb-2 border-b ${headerColorClass}`}>
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span className="flex items-center">
            <span className="mr-2">{stageIcon}</span>
            {title}
          </span>
          <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">
            {count}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-3 overflow-y-auto">
        {candidates.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-xs text-muted-foreground italic bg-white/50 rounded-md border border-dashed p-4 text-center">
            No candidates in this stage
          </div>
        ) : (
          candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default StageColumn;
