"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { AlertCircle, Award, CheckCircle, XCircle } from "lucide-react";
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
    } catch (error) {
      console.error("Error fetching feedback details:", error);
    }
  };

  const calculateOverallRating = () => {
    if (!feedbackData || feedbackData.length === 0) return 0;
    // Simple sum of ratings divided by number of questions
    const sum = feedbackData.reduce(
      (total, item) => total + (item.rating || 0),
      0
    );
    return (sum / feedbackData.length).toFixed(1);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96 text-center shadow-lg">
          <CardContent className="pt-6">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-500">
              Please sign in to view this interview feedback
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallRating = calculateOverallRating();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <Award className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-green-500 mb-2">
          Congratulations!
        </h2>
        <p className="text-gray-600 text-lg">
          Your Interview Performance Review
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Overall Performance</h3>
          <div
            className={`text-4xl font-bold ${getRatingColor(overallRating)}`}
          >
            {overallRating}/10
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Based on {feedbackData?.length || 0} questions
          </p>
        </div>
      </Card>

      <div className="space-y-6">
        {feedbackData &&
          feedbackData.map((feedback, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    Question {index + 1}
                  </h3>
                  <span
                    className={`text-lg font-bold ${getRatingColor(
                      feedback.rating
                    )}`}
                  >
                    {feedback.rating}/10
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-800">
                    {feedback.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <p className="font-medium">Correct Answer</p>
                    </div>
                    <p className="pl-7 text-gray-700">
                      {feedback.correctAnswer}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-blue-600">
                      <XCircle className="w-5 h-5 mr-2" />
                      <p className="font-medium">Your Answer</p>
                    </div>
                    <p className="pl-7 text-gray-700">{feedback.userAnswer}</p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="font-medium text-purple-700 mb-2">
                    Feedback for Improvement
                  </p>
                  <p className="text-gray-700">{feedback.feedback}</p>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Feedback;
