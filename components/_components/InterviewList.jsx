"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import InterviewItemCard from "./InterviewItemCard";

const InterviewList = () => {
  const { user, isLoaded } = useUser();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
      getInterviewDetails();
    }
  }, [isLoaded, user?.primaryEmailAddress?.emailAddress]);

  const getInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(
          eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
        .orderBy(desc(MockInterview.id));

      if (result.length === 0) {
        setError("Interview not found or you don't have access to it");
        return;
      }

      setInterviewData(result);
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
  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-3">
        {interviewData &&
          interviewData.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
      </div>
    </div>
  );
};

export default InterviewList;
