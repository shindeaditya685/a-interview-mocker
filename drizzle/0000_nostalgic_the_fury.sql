CREATE TABLE IF NOT EXISTS "mockInterview" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonMockResp" text NOT NULL,
	"jobPosition" varchar NOT NULL,
	"jobDescription" varchar NOT NULL,
	"jobExperience" varchar NOT NULL,
	"createdBy" varchar NOT NULL,
	"createdAt" varchar,
	"mockId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userAnswer" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockIdRef" varchar NOT NULL,
	"question" varchar NOT NULL,
	"correctAnswer" varchar,
	"userAnswer" text,
	"feedback" text,
	"rating" varchar,
	"userEmail" varchar,
	"createdAt" varchar
);
