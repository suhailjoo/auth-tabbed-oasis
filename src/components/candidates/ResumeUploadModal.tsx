
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Upload, FileText } from "lucide-react";

type ResumeUploadModalProps = {
  buttonClassName?: string;
};

const ResumeUploadModal = ({ buttonClassName }: ResumeUploadModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Just close the modal for now - no actual upload logic yet
    setOpen(false);
    
    // Reset the form
    setSelectedFile(null);
    setCandidateName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName} variant="default">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Upload a candidate's resume to add them to the pipeline.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="candidateName">Candidate Name (Optional)</Label>
            <Input
              id="candidateName"
              placeholder="Enter candidate name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="resume">Resume</Label>
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                id="resume"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <FileText className="h-4 w-4" />
                <span className="truncate">{selectedFile.name}</span>
                <span className="text-xs">
                  ({Math.round(selectedFile.size / 1024)} KB)
                </span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={!selectedFile}
            className="w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeUploadModal;
