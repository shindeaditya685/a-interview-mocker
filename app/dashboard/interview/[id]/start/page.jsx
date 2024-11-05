"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import QuestionSection from "@/components/_components/QuestionsSection";
import RecordAnswerSection from "@/components/_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

const StartInterview = ({ params: rawParams }) => {
  const params = React.use(rawParams);
  const { user, isLoaded } = useUser();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... keeping existing useEffect and functions ...
  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress && params.id) {
      getInterviewDetails();
    }
  }, [isLoaded, user?.primaryEmailAddress?.emailAddress, params.id]);

  const getInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(
          and(
            eq(MockInterview.mockId, params.id),
            eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );

      if (result.length === 0) {
        setError("Interview not found or you don't have access to it");
        return;
      }

      const jsonMockResponse = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestion(jsonMockResponse);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setError("Failed to load interview details");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary relative">
          <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-96 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-yellow-100 p-3 mb-4">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-800">
                Authentication Required
              </h2>
              <p className="text-slate-600 text-center mb-6">
                Please sign in to view this interview
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Sign In to Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-96 shadow-lg">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-800">Error</h2>
              <p className="text-slate-600 text-center mb-6">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full border-2 hover:bg-slate-50"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress =
    ((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {activeQuestionIndex + 1} of{" "}
              {mockInterviewQuestion.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {progress.toFixed(0)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="transition-all duration-300 ease-in-out">
            <QuestionSection
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
            />
          </div>
          <div className="transition-all duration-300 ease-in-out">
            <RecordAnswerSection
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              interviewData={interviewData}
            />
          </div>
        </div>

        <div className="flex justify-between mt-8 px-4">
          {activeQuestionIndex > 0 ? (
            <Button
              variant="outline"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="flex items-center gap-2 border-2 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Question
            </Button>
          ) : (
            <div></div>
          )}

          {activeQuestionIndex < mockInterviewQuestion.length - 1 ? (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Next Question
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Link
              href={`/dashboard/interview/${interviewData?.mockId}/feedback`}
            >
              <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Complete Interview
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
