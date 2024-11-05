"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();
  return (
    <div className="border shadow-sm rounded-lg p-3">
      <h2 className="font-bold text-primary">{interview?.jobPosition}</h2>
      <h2 className="text-sm text-gray-600">
        {interview?.jobExperience} Years of Experience
      </h2>
      <h2 className="text-sm text-gray-400">
        Created At: {interview?.createdAt}
      </h2>
      <div className="flex justify-between mt-2 gap-5">
        <Button
          className="w-full"
          size="sm"
          variant="outline"
          onClick={() =>
            router.push(`/dashboard/interview/${interview?.mockId}/feedback`)
          }
        >
          Feedback
        </Button>
        <Button
          className="w-full"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/interview/${interview?.mockId}/start`)
          }
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;
