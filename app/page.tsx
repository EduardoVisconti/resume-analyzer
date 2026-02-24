"use client";

import React, { useState, useCallback } from "react";
import { Loader2, Sparkles, RotateCcw } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import AnalysisResults from "@/components/AnalysisResults";
import CoverLetterGenerator from "@/components/CoverLetterGenerator";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { AnalysisResult, AnalysisStatus } from "@/types";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState("");
  const { toast } = useToast();

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setAnalysisResult(null);
    setResumeText("");
    setStatus("idle");
  }, []);

  const handleClearFile = useCallback(() => {
    setFile(null);
    setAnalysisResult(null);
    setResumeText("");
    setStatus("idle");
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    setStatus("analyzing");
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);
      setResumeText(data.resumeText);
      setStatus("complete");

      toast({
        title: "Analysis complete",
        description: `Your resume scored ${data.analysis.overallScore}/10`,
      });
    } catch (error) {
      setStatus("error");
      toast({
        title: "Analysis failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    setStatus("idle");
    setAnalysisResult(null);
    setResumeText("");
  };

  const isAnalyzing = status === "analyzing";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
            <h1 className="text-xl font-bold">Resume Analyzer</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="container py-8 max-w-4xl">
        {/* Hero */}
        {!analysisResult && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
              Improve Your Resume with AI
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload your resume to get instant, actionable feedback powered by
              AI. Compare against job descriptions and generate tailored cover
              letters.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* File Upload */}
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={file}
            onClear={handleClearFile}
            isDisabled={isAnalyzing}
            isUploading={isAnalyzing}
          />

          {/* Job Description */}
          {!analysisResult && (
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              isDisabled={isAnalyzing}
            />
          )}

          {/* Action Buttons */}
          {!analysisResult && (
            <div className="flex justify-center gap-3">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className="min-w-[200px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
                <Loader2 className="h-8 w-8 animate-spin absolute top-4 left-4 text-primary" />
              </div>
              <p className="mt-4 text-lg font-medium">Analyzing your resume...</p>
              <p className="text-sm mt-1">
                This usually takes 5-10 seconds
              </p>
            </div>
          )}

          {/* Results */}
          {analysisResult && status === "complete" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Analysis Results</h2>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
              </div>

              <AnalysisResults result={analysisResult} />

              <Separator className="my-6" />

              <CoverLetterGenerator
                resumeText={resumeText}
                jobDescription={jobDescription}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            Resume Analyzer — Powered by AI. Your data is not stored.
          </p>
        </div>
      </footer>
    </div>
  );
}
