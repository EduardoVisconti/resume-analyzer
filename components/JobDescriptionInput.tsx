"use client";

import React from "react";
import { Briefcase } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

export default function JobDescriptionInput({
  value,
  onChange,
  isDisabled,
}: JobDescriptionInputProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
          <CardTitle className="text-lg">Job Description</CardTitle>
        </div>
        <CardDescription>
          Paste the job description to get a match score and targeted feedback
          (optional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste the job description here to compare against your resume..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className="min-h-[160px] resize-y"
          aria-label="Job description"
        />
        {value.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {value.split(/\s+/).filter(Boolean).length} words
          </p>
        )}
      </CardContent>
    </Card>
  );
}
