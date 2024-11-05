"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Feedback = ({ params: rawParams }) => {
  const params = React.use(rawParams);
  const { user, isLoaded } = useUser();
  const [feedbackData, setFeedbackData] = useState(null);

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress && params.id) {
      getFeedback();
    }
  }, [isLoaded, user?.primaryEmailAddress?.emailAddress, params.id]);

  const getFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(
          and(
            eq(UserAnswer.mockIdRef, params.id),
            eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress)
          )
        )
        .orderBy(UserAnswer.id);

      setFeedbackData(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching feedback details:", error);
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
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
      <h2 className="text-primary text-lg my-3">
        Your overall interview rating: <strong>7/10</strong>
      </h2>
      <h2 className="text-sm text-gray-500">
        Find below interview question with correct answer, Your answer and
        feedback for improvement
      </h2>

      {/* Display feedback data */}
      {feedbackData &&
        feedbackData.map((feedback, index) => (
          <div key={index} className="mt-6 p-4 border rounded-lg">
            <h3 className="font-semibold">Question {index + 1}</h3>
            <p className="mt-2">{feedback.question}</p>
            <div className="mt-2">
              <p className="text-green-600">Correct Answer:</p>
              <p>{feedback.correctAnswer}</p>
            </div>
            <div className="mt-2">
              <p className="text-blue-600">Your Answer:</p>
              <p>{feedback.userAnswer}</p>
            </div>
            <div className="mt-2">
              <p className="text-purple-600">Feedback:</p>
              <p>{feedback.feedback}</p>
            </div>
            <div className="mt-2">
              <p className="text-orange-600">Rating: {feedback.rating}/10</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Feedback;
