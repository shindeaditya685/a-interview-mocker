import { pgTable, varchar, text, serial } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDescription: varchar("jobDescription").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"),
  mockId: varchar("mockId").notNull(),
});

export const UserAnswer = pgTable("useranswer", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockidref").notNull(),
  question: varchar("question").notNull(),
  correctAnswer: varchar("correctanswer"),
  userAnswer: text("useranswer"),
  feedback: text("feedback"),
  rating: varchar("rating"),
  userEmail: varchar("useremail"),
  createdAt: varchar("createdat"),
});
