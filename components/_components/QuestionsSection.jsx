"use client";

import React, { useEffect, useState } from "react";
import { Lightbulb, Volume2, VolumeX } from "lucide-react";

const QuestionSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  setActiveQuestionIndex,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    // Initialize speech synthesis and get available voices
    const initVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      // Select a default English voice if available
      const englishVoice = voices.find((voice) => voice.lang.includes("en"));
      setSelectedVoice(englishVoice || voices[0]);
    };

    // Handle voice list changing (some browsers load voices asynchronously)
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = initVoices;
      initVoices();
    }

    // Cleanup function to cancel any ongoing speech when component unmounts
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const textToSpeech = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Sorry, your browser does not support text to speech.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Configure speech settings
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume

    // Handle speech events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!mockInterviewQuestion) return null;

  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion.map((question, index) => (
          <h2
            key={index}
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer transition-colors
              ${
                activeQuestionIndex === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }
            `}
            onClick={() => setActiveQuestionIndex(index)}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      <div className="my-5 flex items-start gap-4">
        <h2 className="text-sm md:text-lg flex-1">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>
        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <VolumeX
              className="cursor-pointer text-primary hover:text-primary/80"
              onClick={stopSpeaking}
            />
          ) : (
            <Volume2
              className="cursor-pointer text-primary hover:text-primary/80"
              onClick={() =>
                textToSpeech(
                  mockInterviewQuestion[activeQuestionIndex]?.question
                )
              }
            />
          )}
        </div>
      </div>

      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className="text-sm text-primary my-2">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </h2>
      </div>
    </div>
  );
};

export default QuestionSection;
