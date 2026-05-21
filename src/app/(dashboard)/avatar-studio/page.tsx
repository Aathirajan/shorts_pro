'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';
import { Avatar, AvatarVoice } from '@/types';
import { Play, User, Mic, Sparkles, Clock, Globe, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock avatars
const mockAvatars: Avatar[] = [
  {
    id: '1',
    name: 'Sarah',
    thumbnailUrl: '',
    previewVideoUrl: '',
    isPremium: false,
  },
  {
    id: '2',
    name: 'David',
    thumbnailUrl: '',
    previewVideoUrl: '',
    isPremium: false,
  },
  {
    id: '3',
    name: 'Emma',
    thumbnailUrl: '',
    previewVideoUrl: '',
    isPremium: true,
  },
  {
    id: '4',
    name: 'Michael',
    thumbnailUrl: '',
    previewVideoUrl: '',
    isPremium: true,
  },
  {
    id: '5',
    name: 'Sophia',
    thumbnailUrl: '',
    previewVideoUrl: '',
    isPremium: true,
  },
  {
    id: '6',
    name: 'James',
    thumbnailUrl: '',
    previewVideoUrl: '',
    isPremium: true,
  },
];

// Mock voices
const mockVoices: AvatarVoice[] = [
  { id: '1', name: 'Natural', previewUrl: '', accent: 'American', gender: 'female' },
  { id: '2', name: 'Professional', previewUrl: '', accent: 'American', gender: 'male' },
  { id: '3', name: 'Friendly', previewUrl: '', accent: 'British', gender: 'female' },
  { id: '4', name: 'Energetic', previewUrl: '', accent: 'Australian', gender: 'male' },
];

export default function AvatarStudioPage() {
  const router = useRouter();
  const [script, setScript] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('1');
  const [selectedVoice, setSelectedVoice] = useState<string>('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Mock plan check - would come from user session
  const planConfig = { plan: 'PRO' as const };
  const userPlan: string = planConfig.plan;
  const minutesUsed = 15;
  const minutesLimit = 30;

  const handleGenerate = async () => {
    if (!script.trim()) return;

    setIsGenerating(true);
    setProgress(0);

    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 800);

    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
      clearInterval(interval);
    }, 16000);
  };

  const handleExport = () => {
    router.push('/projects/1/edit');
  };

  // Calculate estimated duration
  const wordCount = script.split(/\s+/).filter(Boolean).length;
  const estimatedMinutes = Math.ceil(wordCount / 150 * 60) / 60;

  if (userPlan === 'FREE') {
    return (
      <>
        <Topbar title="Avatar Studio" />
        <div className="flex-1 p-6 overflow-auto">
          <PageHeader
            title="AI Avatar Studio"
            description="Generate photorealistic talking head videos from text"
          />
          <UpgradePrompt
            feature="AI Avatar Studio"
            description="Create professional talking head videos without filming. Perfect for faceless channels."
            currentPlan="Free"
            requiredPlan="Creator"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Avatar Studio" />

      <div className="flex-1 p-6 overflow-auto">
        <PageHeader
          title="AI Avatar Studio"
          description="Generate photorealistic talking head videos from text"
        />

        {!showPreview ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Script Input */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Enter Your Script
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    className={cn(
                      'w-full rounded-card border border-border bg-surface',
                      'px-4 py-3 text-sm text-text placeholder:text-text-muted',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
                      'min-h-[200px] resize-y'
                    )}
                    placeholder="Enter your script here... The AI avatar will speak these words with natural lip-sync and expressions."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                  />

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-text-muted">
                      {wordCount} words · ~{estimatedMinutes.toFixed(1)} min
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-text-muted" />
                      <span className="text-text-muted">
                        {minutesUsed} / {minutesLimit} min used this month
                      </span>
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Generating avatar video...</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    disabled={!script.trim() || isGenerating}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Avatar Video'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Avatar Selection */}
            <div className="space-y-6">
              {/* Avatar Grid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Choose Avatar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {mockAvatars.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={cn(
                          'relative aspect-square rounded-card overflow-hidden',
                          'border-2 transition-all',
                          selectedAvatar === avatar.id
                            ? 'border-text'
                            : 'border-transparent hover:border-text-muted'
                        )}
                      >
                        <div className="w-full h-full bg-surface-2 flex flex-col items-center justify-center">
                          <User className="w-8 h-8 text-text-muted mb-2" />
                          <span className="text-xs font-medium">{avatar.name}</span>
                        </div>
                        {avatar.isPremium && (
                          <Badge
                            variant="warning"
                            size="sm"
                            className="absolute top-1 right-1"
                          >
                            PRO
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Voice Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Voice Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockVoices.map((voice) => (
                      <button
                        key={voice.id}
                        onClick={() => setSelectedVoice(voice.id)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-button',
                          'border-2 transition-all text-left',
                          selectedVoice === voice.id
                            ? 'border-text bg-surface-2'
                            : 'border-transparent hover:bg-surface-2'
                        )}
                      >
                        <Volume2 className="w-4 h-4 text-text-muted" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{voice.name}</p>
                          <p className="text-xs text-text-muted">
                            {voice.gender === 'male' ? 'Male' : 'Female'} · {voice.accent}
                          </p>
                        </div>
                        <button className="p-1.5 hover:bg-surface rounded">
                          <Play className="w-3 h-3" />
                        </button>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Preview</CardTitle>
                    <p className="text-sm text-text-muted">
                      Your AI avatar video is ready
                    </p>
                  </div>
                  <Badge variant="success">Ready</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Preview */}
                <div className="aspect-video bg-surface-2 rounded-card flex items-center justify-center">
                  <div className="text-center">
                    <User className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted">Avatar Video Preview</p>
                    <p className="text-sm text-text-muted mt-1">
                      {mockAvatars.find((a) => a.id === selectedAvatar)?.name} · {estimatedMinutes.toFixed(1)} min
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setShowPreview(false)}>
                    Create Another
                  </Button>
                  <Button onClick={handleExport}>
                    Add to Editor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
