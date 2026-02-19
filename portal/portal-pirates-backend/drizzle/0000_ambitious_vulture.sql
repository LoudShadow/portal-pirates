CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"vendor" text NOT NULL,
	"time" timestamp with time zone DEFAULT now() NOT NULL
);
