"use client";

import React, { useState } from "react";
import { FileSignature, Copy, Check, Loader2, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CoverLetterGeneratorProps {
  resumeText: string;
  jobDescription: string;
}

export default function CoverLetterGenerator({
  resumeText,
  jobDescription,
}: CoverLetterGeneratorProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description:
          "Please provide a job description to generate a cover letter.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setCoverLetter("");

    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate cover letter");
      }

      const data = await response.json();
      setCoverLetter(data.coverLetter);

      toast({
        title: "Cover letter generated",
        description: "Your personalized cover letter is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Cover letter copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Please select the text and copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover-letter.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-lg">Cover Letter Generator</CardTitle>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription.trim()}
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Cover Letter"
            )}
          </Button>
        </div>
        <CardDescription>
          {jobDescription.trim()
            ? "Generate a tailored cover letter based on your resume and the job description"
            : "Add a job description above to enable cover letter generation"}
        </CardDescription>
      </CardHeader>

      {(coverLetter || isGenerating) && (
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-3" />
              <p className="text-sm">Crafting your cover letter...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[300px] resize-y font-serif text-sm leading-relaxed"
                aria-label="Generated cover letter"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
