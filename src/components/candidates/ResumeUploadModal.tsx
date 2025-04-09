
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
import { UserPlus, Upload, FileText, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type ResumeUploadModalProps = {
  buttonClassName?: string;
};

const ResumeUploadModal = ({ buttonClassName }: ResumeUploadModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { jobId } = useParams<{ jobId: string }>();
  const { user, orgId } = useAuthStore();
  const { toast } = useToast();

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

  const handleUpload = async () => {
    if (!selectedFile || !jobId || !orgId || !user) return;
    
    try {
      setIsUploading(true);
      
      // Generate file name
      const fileExt = selectedFile.name.split('.').pop();
      const timestamp = format(new Date(), "yyyyMMdd-HHmmss");
      const sanitizedName = (candidateName || selectedFile.name.split('.')[0])
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      
      const fileName = `${sanitizedName}-${timestamp}.${fileExt}`;
      const filePath = `${orgId}/${jobId}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);
      
      const resumeUrl = publicUrlData.publicUrl;
      
      // Save candidate to database using generic RPC to work around TypeScript limitations
      const candidateNameToUse = candidateName || selectedFile.name.split('.')[0];
      
      // We need to use the more generic approach since TypeScript doesn't know about the candidates table
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .insert({
          job_id: jobId,
          org_id: orgId,
          name: candidateNameToUse,
          resume_url: resumeUrl,
          stage: 'applied',
          created_by: user.id
        })
        .select('id')
        .single();
      
      if (candidateError) {
        console.error("Error inserting candidate:", candidateError);
        throw candidateError;
      }
      
      // Insert workflow job for AI parsing
      const { error: workflowError } = await supabase
        .from('workflow_jobs')
        .insert({
          job_type: 'parse_resume',
          trigger_type: 'resume_uploaded',
          org_id: orgId,
          job_id: jobId,
          payload: {
            candidate_id: candidateData.id,
            resume_url: resumeUrl
          },
          status: 'pending'
        });
      
      if (workflowError) {
        console.error("Error creating workflow job:", workflowError);
        throw workflowError;
      }
      
      // Show success toast
      toast({
        title: "Resume uploaded",
        description: "Parsing in progress...",
        variant: "default",
      });
      
      // Reset form and close modal
      setSelectedFile(null);
      setCandidateName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setOpen(false);
      
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isValidFileType = !selectedFile || 
    selectedFile.type === "application/pdf" || 
    selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

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
              disabled={isUploading}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="resume">Resume</Label>
            
            <Card 
              className={cn(
                "border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors cursor-pointer",
                isDragging && "border-primary bg-primary/5",
                selectedFile && "border-primary/50",
                isUploading && "opacity-70 cursor-not-allowed"
              )}
            >
              <CardContent 
                className="flex flex-col items-center justify-center p-6"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={isUploading ? undefined : triggerFileInput}
              >
                <Input
                  ref={fileInputRef}
                  id="resume"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                
                {selectedFile ? (
                  <div className="text-center">
                    <FileText className="h-10 w-10 mx-auto text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    {!isUploading && (
                      <p className="text-xs text-primary/80 mt-3">Click or drag to change file</p>
                    )}
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
                
                {isUploading && (
                  <div className="absolute inset-0 bg-background/40 flex items-center justify-center rounded-md">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {selectedFile && !isValidFileType && (
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
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={!selectedFile || !isValidFileType || isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeUploadModal;
