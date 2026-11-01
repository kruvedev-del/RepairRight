import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { evaluateSafetyAndGuidance, RepairCheckInput, RepairCheckResult } from './src/lib/safety';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Repair check API endpoint
app.post('/api/repair-check', async (req: Request, res: Response) => {
  try {
    const input: RepairCheckInput = req.body;

    // 1. Immediate Safety / Hazard gate: If hazard reported or demo requested, use deterministic rules
    if (input.hazardReported || (input.hazardTypes && input.hazardTypes.length > 0) || input.isDemo) {
      const result = evaluateSafetyAndGuidance(input);
      return res.json(result);
    }

    // 2. If Gemini API key is configured and user consented to AI assistance
    if (process.env.GEMINI_API_KEY && input.consentGiven) {
      try {
        const ai = new GoogleGenAI();
        const prompt = `You are the safety and repair-support guidance engine for RepairRight.
Brand promise: "Know your next safe step."

User Appliance: ${input.appliance || 'Washing machine'}
Reported Symptom: ${input.symptom}
Additional details: ${input.symptomDescription || 'None'}
Brand: ${input.brand || 'Unspecified'}
Model: ${input.model || 'Unspecified'}
Hazard signs reported: ${input.hazardReported ? 'YES' : 'NO'}
Audio attachment: ${input.audioAttached ? 'Audio clip attached (FOR TECHNICIAN REFERENCE ONLY — sound alone is not diagnostic)' : 'No audio attached'}

CRITICAL SAFETY AND BEHAVIOR INSTRUCTIONS:
- You must NOT present an unverified fault as a confirmed diagnosis or claim to replace a repair professional.
- Return a structured result matching the schema.
- Give at most three safe, non-invasive checks, and ONLY when relevant and supported.
- NEVER instruct users to open an appliance cabinet, touch internal parts or wiring, disassemble covers, bypass safety features, or work on high-risk electricity, gas, or plumbing.
- When information is incomplete or confidence is low, say so clearly in 'uncertainty' and recommend professional help.
- Keep the result concise, reassuring, and easy to share with a technician.`;

        const repairSchema: Schema = {
          type: Type.OBJECT,
          properties: {
            is_hazard: { type: Type.BOOLEAN },
            summary: { type: Type.STRING, description: 'Concise factual summary of what the user told us' },
            safe_checks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'At most 3 non-invasive, safe external checks only (e.g. leveling, external lint filter, load balancing). Never internal parts.' 
            },
            uncertainty: { type: Type.STRING, description: 'Explanation of what cannot be confirmed without hands-on technician testing' },
            risk_level: { type: Type.STRING, enum: ['critical_hazard', 'medium', 'low'] },
            next_step: { type: Type.STRING, description: 'Clear recommended next step' },
            professional_help_needed: { type: Type.BOOLEAN, description: 'Whether a licensed repair professional is recommended' },
          },
          required: ['is_hazard', 'summary', 'safe_checks', 'uncertainty', 'risk_level', 'next_step', 'professional_help_needed'],
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: repairSchema,
            temperature: 0.2,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          // Strictly cap safe checks to at most 3
          const cappedChecks = (parsed.safe_checks || []).slice(0, 3);
          const result: RepairCheckResult = {
            is_hazard: parsed.is_hazard || false,
            summary: parsed.summary,
            safe_checks: cappedChecks,
            uncertainty: parsed.uncertainty,
            risk_level: parsed.risk_level || 'low',
            next_step: parsed.next_step,
            professional_help_needed: parsed.professional_help_needed ?? true,
            disclaimer: 'AI-assisted safe guidance. RepairRight organizes your details for dialogue with a qualified repair pro.',
            mode: 'ai_assisted',
            timestamp: new Date().toISOString(),
          };
          return res.json(result);
        }
      } catch (aiErr) {
        console.warn('Gemini API call failed or timed out, falling back to safe rules engine:', aiErr);
      }
    }

    // 3. Fallback to deterministic rules engine (clean demo mode)
    const result = evaluateSafetyAndGuidance(input);
    return res.json(result);
  } catch (error) {
    console.error('Error handling repair check:', error);
    return res.status(500).json({ error: 'Failed to process repair check' });
  }
});

// App status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'RepairRight Prototype',
    ai_configured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`RepairRight server listening on port ${PORT}`);
  });
}

startServer();
