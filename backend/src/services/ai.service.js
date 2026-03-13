const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


// ================= ZOD SCHEMA =================

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Match score between candidate resume and job description"),

  technicalQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      })
    )
    .min(5)
    .max(10),

  behavioralQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      })
    )
    .min(3)
    .max(5),

  skillGaps: z
    .array(
      z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"]),
      })
    )
    .min(3)
    .max(5),

  preparationPlan: z
    .array(
      z.object({
        day: z.number(),
        focus: z.string(),
        task: z.array(z.string()).min(3),
      })
    )
    .length(7),
});


// ================= AI SERVICE =================

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical interviewer.

Analyze the candidate using the following information.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Generate a structured interview preparation report.

Return ONLY valid JSON.

Structure:

{
 "matchScore": number,
 "technicalQuestions":[
  {
   "question":"string",
   "intention":"string",
   "answer":"string"
  }
 ],
 "behavioralQuestions":[
  {
   "question":"string",
   "intention":"string",
   "answer":"string"
  }
 ],
 "skillGaps":[
  {
   "skill":"string",
   "severity":"low | medium | high"
  }
 ],
 "preparationPlan":[
  {
   "day":1,
   "focus":"string",
   "task":["string","string","string"]
  }
 ]
}

Rules:

- matchScore must be between 0 and 100
- Generate 5 technical questions
- Generate 3 behavioral questions
- Generate 3 skill gaps
- Generate a 7 day preparation plan
- Each day must contain at least 3 tasks
- Return JSON only
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const rawText = response.text;

  console.log("AI RAW RESPONSE:\n", rawText);


  // ========= CLEAN JSON =========

  const jsonStart = rawText.indexOf("{");
  const jsonEnd = rawText.lastIndexOf("}") + 1;

  const cleanJson = rawText.slice(jsonStart, jsonEnd);

  const parsedData = JSON.parse(cleanJson);


  // ========= VALIDATE WITH ZOD =========

  const validatedData = interviewReportSchema.parse(parsedData);

  return validatedData;
}


// ================= TEST FUNCTION =================

async function invokeGeminiAi() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain what an interview is.",
  });

  console.log(response.text);
}


module.exports = {
  generateInterviewReport,
};