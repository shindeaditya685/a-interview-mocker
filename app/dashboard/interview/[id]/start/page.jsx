"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";

const StartInterview = ({ params }) => {
  const { user, isLoaded } = useUser();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
      getInterviewDetails();
    }
  }, [isLoaded, user?.primaryEmailAddress?.emailAddress, params?.id]);

  const getInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(
          and(
            eq(MockInterview.mockId, params?.id),
            eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      const jsonMockResponse = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestion(jsonMockResponse);
      setInterviewData(result[0]);

      console.log(jsonMockResponse);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  if (!isLoaded) {
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
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Questions */}
        <div></div>
        {/* Video/ Audio Recording */}
        <div></div>
      </div>
    </div>
  );
};

export default StartInterview;
