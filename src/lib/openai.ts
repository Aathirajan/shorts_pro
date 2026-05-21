import OpenAI from 'openai';
import { prisma } from './prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Transcribe audio using Whisper
export async function transcribeAudio(audioUrl: string): Promise<{
  text: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
    words: Array<{
      word: string;
      start: number;
      end: number;
    }>;
  }>;
}> {
  const response = await openai.audio.transcriptions.create({
    file: await fetch(audioUrl).then((r) => r.blob() as any),
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
  });

  const segments =
    response.segments?.map((segment) => ({
      start: segment.start,
      end: segment.end,
      text: segment.text,
      words:
        (segment as any).words?.map((w: any) => ({
          word: w.word,
          start: w.start,
          end: w.end,
        })) || [],
    })) || [];

  return {
    text: response.text,
    segments,
  };
}

// Extract viral moments from transcript
export async function extractViralMoments(
  transcript: string,
  duration: number
): Promise<Array<{
  startTime: number;
  endTime: number;
  duration: number;
  predictedRetention: number;
  reason: string;
}>> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert at analyzing video content and identifying viral-worthy moments.
        Extract the top 5 most engaging moments from the transcript.

        Consider:
        - Hook strength (does it grab attention?)
        - Value density (information per second)
        - Emotional impact
        - Shareability

        Return JSON array with: startTime, endTime, duration, predictedRetention (0-100), reason`,
      },
      {
        role: 'user',
        content: `Analyze this transcript and extract viral moments. The full video is ${duration} seconds long:\n\n${transcript}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const result = JSON.parse(content);
  return result.clips || [];
}

// Analyze niche alignment
export async function analyzeNicheAlignment(
  transcript: string,
  channelNiche: string,
  channelKeywords: string[]
): Promise<{
  score: number;
  alignment: 'high' | 'medium' | 'low';
  keywords: string[];
  explanation: string;
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Analyze how well this video aligns with the channel's niche.
        Return a JSON object with:
        - score: 0-100
        - alignment: 'high' | 'medium' | 'low'
        - keywords: matched keywords from the content
        - explanation: brief explanation of the alignment`,
      },
      {
        role: 'user',
        content: `Channel Niche: ${channelNiche}
Channel Keywords: ${channelKeywords.join(', ')}

Video Transcript:\n${transcript}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

// Viral predictor
export async function predictViralScore(
  title: string,
  transcript: string,
  channelHistory: Array<{ title: string; views: number }>
): Promise<{
  score: number;
  breakdown: {
    hookStrength: number;
    retention: number;
    nicheAlignment: number;
    trendingOverlap: number;
  };
  recommendations: string[];
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Predict the viral potential of a YouTube Short.
        Return JSON with:
        - score: 1-100 overall score
        - breakdown: scores for hookStrength, retention, nicheAlignment, trendingOverlap (each 1-100)
        - recommendations: array of actionable tips to improve`,
      },
      {
        role: 'user',
        content: `Title: ${title}

Transcript:\n${transcript}

Channel History (last 10 videos):\n${channelHistory.map((v) => `- ${v.title} (${v.views} views)`).join('\n')}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

// Analyze hook strength
export async function analyzeHook(
  transcript: string
): Promise<{
  strength: number;
  analysis: string;
  suggestions: string[];
}> {
  const first30Seconds = transcript.split(' ').slice(0, 50).join(' ');

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Analyze the hook strength of a YouTube Short opening.
        Return JSON with:
        - strength: 1-10 score
        - analysis: brief analysis
        - suggestions: array of improvement suggestions`,
      },
      {
        role: 'user',
        content: `First 30 seconds:\n${first30Seconds}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

// Detect potential shadowban issues
export async function detectShadowbanRisk(
  title: string,
  transcript: string,
  tags: string[]
): Promise<{
  risk: 'low' | 'medium' | 'high';
  issues: Array<{
    type: 'warning' | 'error';
    message: string;
    fix?: string;
  }>;
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Analyze content for potential YouTube policy violations or shadowban risks.
        Check for:
        - Misleading metadata
        - Excessive capitalization
        - Clickbait tactics
        - Repetitive content

        Return JSON with:
        - risk: 'low' | 'medium' | 'high'
        - issues: array of found issues`,
      },
      {
        role: 'user',
        content: `Title: ${title}
Tags: ${tags.join(', ')}

Transcript:\n${transcript}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

// Track OpenAI usage
export async function logAIUsage(
  userId: string,
  operation: string,
  tokensUsed: number,
  cost: number
): Promise<void> {
  // In production, log to database or analytics
  console.log(`AI Usage: ${userId} - ${operation} - ${tokensUsed} tokens - $${cost}`);
}
