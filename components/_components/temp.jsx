"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "../ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, Camera, Video, Radio } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Card, CardContent } from "@/components/ui/card";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  const startRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer?.length < 10) {
        setLoading(false);
        toast("Error while saving your answer, Please record again!");
        return;
      }
    } else {
      startSpeechToText();
    }
  };

  const updateUserAnswer = async () => {
    setLoading(true);

    const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question} , User Answer: ${userAnswer}, Depends on question and user answer for the given interview question please give use rating for answer and feedback as area of improvement if any in just 3-5 lines to improve it in JSON format with rating filed and feedback field. give rating between 1-10 only. ex:5 NOTE: ONLY RESPONSE NEEDED IN JSON FORMAT BEACAUSE I AM GOING TO PARSE IT.`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");

      const JsonFeedbackResp = JSON.parse(mockJsonResp);
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAnswer: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAnswer: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });

      if (resp) {
        toast("User Answer recorded successfully!");
      }
    } catch (error) {
      toast.error("Error saving answer: " + error.message);
    } finally {
      setUserAnswer("");
      setResults([]);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col w-full max-w-4xl mx-auto px-4">
      <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Camera className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold">
              Interview Recording Session
            </h2>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <Webcam mirrored={true} className="w-full h-[400px] object-cover" />

            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  isRecording ? "bg-red-500/80" : "bg-gray-800/80"
                }`}
              >
                <Radio
                  className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`}
                />
                <span className="text-sm font-medium">
                  {isRecording ? "Recording..." : "Ready"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              disabled={loading}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className={`flex items-center gap-2 px-6 py-4 text-lg font-medium transition-all duration-300 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={startRecording}
            >
              {isRecording ? (
                <>
                  <Mic className="w-5 h-5 animate-pulse" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordAnswerSection;
