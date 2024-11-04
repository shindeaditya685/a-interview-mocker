"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import {
  Lightbulb,
  WebcamIcon,
  Briefcase,
  Code,
  Clock,
  AlertCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

const Interview = ({ params }) => {
  const { user, isLoaded } = useUser();
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

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
      setInterviewData(result[0]);
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Let's Get Started
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">Interview Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Job Role</p>
                  <p className="font-medium">{interviewData?.jobPosition}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Code className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Tech Stack</p>
                  <p className="font-medium">{interviewData?.jobDescription}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Experience Required</p>
                  <p className="font-medium">
                    {interviewData?.jobExperience} years
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-yellow-700">
                  Important Information
                </h3>
              </div>
              <p className="text-yellow-700">
                {process.env.NEXT_PUBLIC_INFORMATION}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {webCamEnabled ? (
                <div className="relative">
                  <Webcam
                    onUserMedia={() => setWebCamEnabled(true)}
                    onUserMediaError={() => setWebCamEnabled(false)}
                    mirrored={true}
                    className="w-full rounded-lg"
                    style={{
                      height: "400px",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => setWebCamEnabled(false)}
                    className="absolute top-4 right-4"
                  >
                    Disable Camera
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-secondary rounded-lg p-8 mb-6">
                    <WebcamIcon className="h-32 w-32 mx-auto text-gray-400" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setWebCamEnabled(true)}
                    className="w-full"
                  >
                    Enable Webcam and Microphone
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Link href={`/dashboard/interview/${params?.id}/start`}>
              <Button className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 hover:from-primary hover:to-purple-700">
                Start Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
