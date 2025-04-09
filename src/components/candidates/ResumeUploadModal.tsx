
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
import { UserPlus, Upload, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ResumeUploadModalProps = {
  buttonClassName?: string;
};

const ResumeUploadModal = ({ buttonClassName }: ResumeUploadModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      if (fileInputRef.current) {
        // Update the file input for consistency
        fileInputRef.current.files = e.dataTransfer.files;
      }
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
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
              className="h-10"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="resume">Resume</Label>
            
            <Card 
              className={cn(
                "border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors cursor-pointer",
                isDragging && "border-primary bg-primary/5",
                selectedFile && "border-primary/50"
              )}
            >
              <CardContent 
                className="flex flex-col items-center justify-center p-6"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <Input
                  ref={fileInputRef}
                  id="resume"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="text-center">
                    <FileText className="h-10 w-10 mx-auto text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <p className="text-xs text-primary/80 mt-3">Click or drag to change file</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Drag & drop your file here</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      or click to browse
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Accepts .pdf, .docx files
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {selectedFile && selectedFile.type !== "application/pdf" && 
             selectedFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
              <div className="flex items-center gap-2 text-sm text-destructive mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>Please upload a PDF or DOCX file.</span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto order-1 sm:order-none"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={!selectedFile}
            className="w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeUploadModal;
