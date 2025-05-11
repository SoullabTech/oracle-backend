// src/routes/survey.routes.ts

import { Router } from 'express';
import { processSurveySubmission } from '../services/surveyService';
import { z } from 'zod';

const router = Router();

// Define the expected shape of the survey submission
const SurveySubmissionSchema = z.object({
  userId: z.string(),
  crystalFocus: z.record(z.any()),
  responses: z.array(
    z.object({
      questionId: z.string(),
      answer: z.number().min(1).max(5),
    })
  ),
});

// POST /api/oracle/survey
router.post('/', async (req, res) => {
  const parseResult = SurveySubmissionSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid survey submission data',
      details: parseResult.error.flatten(),
    });
  }

  try {
    const submission = parseResult.data;
    const result = await processSurveySubmission(submission);

    if (!result) {
      return res.status(500).json({ success: false, error: 'Processing failed' });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('❌ Survey processing error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unexpected server error',
    });
  }
});

export default router;
