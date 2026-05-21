import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { predictViralScore, analyzeHook, detectShadowbanRisk, analyzeNicheAlignment } from '@/lib/openai';
import { z } from 'zod';

// Schema for audit request validation
const auditRequestSchema = z.object({
  projectId: z.string().cuid().optional(),
  channelId: z.string().cuid(),
  title: z.string().min(1).max(200),
  transcript: z.string().min(10),
  tags: z.array(z.string()).optional(),
  description: z.string().max(500).optional(),
});

// POST /api/audit - Run full algorithmic audit (Satura Scan)
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
    const validatedData = auditRequestSchema.parse(body);

    // Get channel data for niche context
    const channel = await prisma.channel.findUnique({
      where: { id: validatedData.channelId, userId: session.user.id },
    });

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Get channel history for context
    const channelHistory = await prisma.project.findMany({
      where: { channelId: validatedData.channelId, status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 10,
      select: { title: true },
    });

    const historyWithViews = channelHistory.map((p) => ({
      title: p.title,
      views: Math.floor(Math.random() * 10000) + 1000, // Mock views until real analytics
    }));

    // Run AI analysis in parallel
    const [viralPrediction, hookAnalysis, shadowbanCheck, nicheAnalysis] = await Promise.all([
      predictViralScore(validatedData.title, validatedData.transcript, historyWithViews),
      analyzeHook(validatedData.transcript),
      detectShadowbanRisk(validatedData.title, validatedData.transcript, validatedData.tags || []),
      analyzeNicheAlignment(
        validatedData.transcript,
        channel.niche || 'General',
        channel.keywords || []
      ),
    ]);

    // Calculate final viral score (weighted average)
    const finalViralScore = Math.round(
      viralPrediction.score * 0.4 +
      hookAnalysis.strength * 10 * 0.3 +
      (shadowbanCheck.risk === 'low' ? 100 : shadowbanCheck.risk === 'medium' ? 70 : 40) * 0.3
    );

    // Build audit result
    const auditResult = {
      viralScore: finalViralScore,
      hookStrength: hookAnalysis.strength,
      nicheAlignment: nicheAnalysis.score / 100,
      shadowbanRisk: shadowbanCheck.risk,
      breakdown: {
        hookStrength: hookAnalysis.strength * 10,
        retention: viralPrediction.breakdown.retention,
        nicheAlignment: nicheAnalysis.score,
        trendingOverlap: viralPrediction.breakdown.trendingOverlap,
      },
      issues: [
        ...hookAnalysis.suggestions.map((s) => ({
          type: 'warning' as const,
          message: s,
          fix: s.includes('should') ? s : undefined,
        })),
        ...shadowbanCheck.issues,
      ],
      recommendations: [
        ...viralPrediction.recommendations,
        ...hookAnalysis.suggestions,
        nicheAnalysis.explanation,
      ].filter(Boolean).slice(0, 7),
    };

    // Save audit to database
    const audit = await prisma.audit.create({
      data: {
        userId: session.user.id,
        projectId: validatedData.projectId,
        channelId: validatedData.channelId,
        status: 'COMPLETED',
        viralScore: finalViralScore,
        hookStrength: hookAnalysis.strength,
        nicheAlignment: nicheAnalysis.score / 100,
        shadowbanRisk: shadowbanCheck.risk,
        issues: auditResult.issues,
        recommendations: auditResult.recommendations,
        completedAt: new Date(),
      },
    });

    // Update project if linked
    if (validatedData.projectId) {
      await prisma.project.update({
        where: { id: validatedData.projectId },
        data: {
          viralScore: finalViralScore,
          hookStrength: hookAnalysis.strength,
          nicheAlignment: nicheAnalysis.score / 100,
          auditCompleted: true,
        },
      });
    }

    return NextResponse.json({
      audit: {
        id: audit.id,
        status: audit.status,
        viralScore: audit.viralScore,
        hookStrength: audit.hookStrength,
        nicheAlignment: audit.nicheAlignment,
        shadowbanRisk: audit.shadowbanRisk,
        issues: audit.issues,
        recommendations: audit.recommendations,
        createdAt: audit.createdAt,
        completedAt: audit.completedAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Failed to run audit:', error);
    return NextResponse.json(
      { error: 'Failed to run audit' },
      { status: 500 }
    );
  }
}

// GET /api/audit - Get audit history for a project or channel
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const channelId = searchParams.get('channelId');

    if (!projectId && !channelId) {
      return NextResponse.json(
        { error: 'projectId or channelId is required' },
        { status: 400 }
      );
    }

    const whereClause: { userId: string; projectId?: string; channelId?: string } = {
      userId: session.user.id,
    };

    if (projectId) {
      whereClause.projectId = projectId;
    } else if (channelId) {
      whereClause.channelId = channelId;
    }

    const audits = await prisma.audit.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ audits });
  } catch (error) {
    console.error('Failed to fetch audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}
