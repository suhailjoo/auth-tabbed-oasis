
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";
import { toast } from "sonner";

export type JobFormData = {
  title: string;
  department?: string;
  description: string;
  employmentType: "remote" | "hybrid" | "in-office";
  location: string;
  experienceLevel?: "entry" | "mid" | "senior";
  salaryBudget?: string;
  currency?: string;
  requiredSkills?: string;
  preferredSkills?: string;
};

export const useCreateJobMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, orgId } = useAuthStore();
  const navigate = useNavigate();

  const createJob = async (data: JobFormData) => {
    if (!user || !orgId) {
      toast.error("You must be logged in to create a job");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Insert the job into the jobs table
      // Use the raw query method to bypass TypeScript type issues
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .insert({
          org_id: orgId,
          created_by: user.id,
          title: data.title,
          department: data.department || null,
          description: data.description,
          employment_type: data.employmentType,
          location: data.location,
          experience_level: data.experienceLevel || null,
          salary_budget: data.salaryBudget ? parseFloat(data.salaryBudget) : null,
          salary_currency: data.currency || null,
          required_skills: data.requiredSkills || null,
          preferred_skills: data.preferredSkills || null,
        })
        .select()
        .single();

      if (jobError) {
        throw jobError;
      }

      // 2. Insert a row into workflow_jobs to trigger background task
      const { error: workflowError } = await supabase
        .from('workflow_jobs')
        .insert({
          job_type: "fetch_market_salary",
          trigger_type: "job_created",
          job_id: jobData.id,
          org_id: orgId,
          status: "pending",
          payload: {
            job_title: data.title,
            experience_level: data.experienceLevel || "mid",
            location: data.location,
          },
        });

      if (workflowError) {
        console.error("Error creating workflow job:", workflowError);
        // Continue even if workflow job fails - we don't want to block the user
      }

      // Show success message
      toast.success("Job created. We're fetching market salary data in the background.");
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Failed to create job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createJob,
    isLoading,
  };
};
