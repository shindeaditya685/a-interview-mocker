import React, { useEffect, useState } from "react";
import { Lightbulb, Volume2, VolumeX } from "lucide-react";
import { Card } from "@/components/ui/card";

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  // ... keeping all existing state and logic ...
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
    <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {mockInterviewQuestion.map((question, index) => (
          <div
            key={index}
            className={`py-2 px-3 rounded-full text-xs md:text-sm text-center cursor-pointer transition-all duration-300 transform hover:scale-105
              ${
                activeQuestionIndex === index
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
          >
            Question #{index + 1}
          </div>
        ))}
      </div>

      <div className="my-6 flex items-start gap-4">
        <h2 className="text-sm md:text-lg flex-1 text-slate-800 leading-relaxed">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>
        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <button
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
              onClick={stopSpeaking}
            >
              <VolumeX className="h-5 w-5 text-red-600" />
            </button>
          ) : (
            <button
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
              onClick={() =>
                textToSpeech(
                  mockInterviewQuestion[activeQuestionIndex]?.question
                )
              }
            >
              <Volume2 className="h-5 w-5 text-blue-600" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Lightbulb className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-blue-800">Important Note</h3>
        </div>
        <p className="text-sm text-blue-700 leading-relaxed">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </p>
      </div>
    </Card>
  );
};

export default QuestionSection;
