import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { predictViralScore, analyzeHook, detectShadowbanRisk } from '@/lib/openai';
import { prisma } from '@/lib/prisma';

// POST /api/viral-predictor - Predict viral potential of a video
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, transcript, tags, channelId, projectId } = body;

    if (!title || !transcript) {
      return NextResponse.json(
        { error: 'Title and transcript are required' },
        { status: 400 }
      );
    }

    // Get channel history for context
    let channelHistory: Array<{ title: string; views: number }> = [];
    if (channelId) {
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        include: {
          projects: {
            where: { status: 'PUBLISHED' },
            orderBy: { publishedAt: 'desc' },
            take: 10,
            select: { title: true },
          },
        },
      });

      if (channel) {
        channelHistory = channel.projects.map((p) => ({
          title: p.title,
          views: Math.floor(Math.random() * 10000) + 1000, // Mock views for now
        }));
      }
    }

    // Run AI analysis in parallel
    const [viralPrediction, hookAnalysis, shadowbanCheck] = await Promise.all([
      predictViralScore(title, transcript, channelHistory),
      analyzeHook(transcript),
      detectShadowbanRisk(title, transcript, tags || []),
    ]);

    // Calculate final score (weighted average)
    const finalScore = Math.round(
      viralPrediction.score * 0.4 +
      hookAnalysis.strength * 10 * 0.3 +
      (shadowbanCheck.risk === 'low' ? 100 : shadowbanCheck.risk === 'medium' ? 70 : 40) * 0.3
    );

    const prediction = {
      score: finalScore,
      breakdown: {
        hookStrength: hookAnalysis.strength * 10,
        retention: viralPrediction.breakdown.retention,
        nicheAlignment: viralPrediction.breakdown.nicheAlignment,
        trendingOverlap: viralPrediction.breakdown.trendingOverlap,
      },
      recommendations: [
        ...viralPrediction.recommendations,
        ...hookAnalysis.suggestions,
        ...(shadowbanCheck.issues.map((i) => i.fix || i.message)),
      ].filter(Boolean).slice(0, 5),
      shadowbanRisk: shadowbanCheck.risk,
      hookAnalysis: hookAnalysis.analysis,
    };

    // Update project with viral score if projectId provided
    if (projectId) {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          viralScore: finalScore,
          hookStrength: hookAnalysis.strength,
        },
      });
    }

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error('Failed to predict viral score:', error);
    return NextResponse.json(
      { error: 'Failed to predict viral score' },
      { status: 500 }
    );
  }
}
