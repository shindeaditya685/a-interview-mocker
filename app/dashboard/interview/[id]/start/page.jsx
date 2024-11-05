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
import { AlertCircle } from "lucide-react";

const StartInterview = ({ params: rawParams }) => {
  const params = React.use(rawParams);
  const { user, isLoaded } = useUser();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-500">
              Please sign in to view this interview
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Questions Found</h2>
            <p className="text-gray-500">
              This interview doesn't have any questions yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6 my-10">
        {activeQuestionIndex > 0 && (
          <Button
            variant="outline"
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          >
            Previous Question
          </Button>
        )}
        {activeQuestionIndex < mockInterviewQuestion.length - 1 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button
              variant="default"
              className="bg-green-500 hover:bg-green-600"
            >
              End Interview
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
