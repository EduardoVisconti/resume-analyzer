"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Target,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalysisResult } from "@/types";
import {
  getScoreColor,
  getScoreBgColor,
  getMatchScoreLabel,
} from "@/lib/utils";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Overall Score
                </p>
                <p className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore}
                  <span className="text-lg text-muted-foreground font-normal">
                    /10
                  </span>
                </p>
              </div>
              <div className="h-20 w-20">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="8"
                    strokeDasharray={`${(result.overallScore / 10) * 251.2} 251.2`}
                    strokeLinecap="round"
                    className={getScoreBgColor(result.overallScore)}
                    style={{ stroke: "currentColor" }}
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {result.matchScore !== undefined && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Job Match
                  </p>
                  <Badge
                    variant={
                      result.matchScore >= 70 ? "success" : "warning"
                    }
                  >
                    {getMatchScoreLabel(result.matchScore)}
                  </Badge>
                </div>
                <p className={`text-5xl font-bold ${getScoreColor(result.matchScore / 10)}`}>
                  {result.matchScore}
                  <span className="text-lg text-muted-foreground font-normal">
                    %
                  </span>
                </p>
                <Progress value={result.matchScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-6">
          <p className="text-sm leading-relaxed">{result.summary}</p>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="strengths" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strengths" className="text-xs sm:text-sm">
            Strengths
          </TabsTrigger>
          <TabsTrigger value="improvements" className="text-xs sm:text-sm">
            Improvements
          </TabsTrigger>
          <TabsTrigger value="redflags" className="text-xs sm:text-sm">
            Red Flags
          </TabsTrigger>
          <TabsTrigger value="keywords" className="text-xs sm:text-sm">
            Keywords
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strengths">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
                <CardTitle className="text-lg">Strengths</CardTitle>
              </div>
              <CardDescription>
                What your resume does well
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                <CardTitle className="text-lg">Areas for Improvement</CardTitle>
              </div>
              <CardDescription>
                Suggestions to make your resume stronger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.improvements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" aria-hidden="true" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redflags">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                <CardTitle className="text-lg">Red Flags</CardTitle>
              </div>
              <CardDescription>
                Issues that could hurt your chances
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.redFlags.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No red flags detected — great job!
                </p>
              ) : (
                <ul className="space-y-3">
                  {result.redFlags.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" aria-hidden="true" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-lg">Keyword Analysis</CardTitle>
              </div>
              <CardDescription>
                Important keywords found and missing in your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2 text-green-600 dark:text-green-400">
                  Present Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.present.map((keyword, i) => (
                    <Badge key={i} variant="success">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2 text-red-600 dark:text-red-400">
                  Missing Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.missing.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No missing keywords detected
                    </p>
                  ) : (
                    result.keywords.missing.map((keyword, i) => (
                      <Badge key={i} variant="destructive">
                        {keyword}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Formatting Feedback */}
      {result.formatting.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle className="text-lg">Formatting Feedback</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.formatting.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary mt-1">&#8226;</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
