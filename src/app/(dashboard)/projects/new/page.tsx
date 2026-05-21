'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  Upload,
  Link as LinkIcon,
  UserCircle,
  ChevronRight,
  FileVideo,
  CheckCircle,
  AlertCircle,
  Wand2,
  Mic,
  Clock,
  Film,
  ArrowLeft,
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';

type CreationMethod = 'upload' | 'url' | 'avatar';
type Step = 'method' | 'input' | 'details' | 'processing';

interface ExtractedClip {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  thumbnailUrl?: string;
  predictedRetention: number;
  transcript: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<CreationMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Magic clips state
  const [sourceUrl, setSourceUrl] = useState('');
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [extractedClips, setExtractedClips] = useState<ExtractedClip[]>([]);
  const [selectedClips, setSelectedClips] = useState<string[]>([]);

  // Avatar state
  const [avatarScript, setAvatarScript] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('default');
  const [selectedVoice, setSelectedVoice] = useState<string>('default');
  const [estimatedDuration, setEstimatedDuration] = useState(0);

  // Project details
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleMethodSelect = (selectedMethod: CreationMethod) => {
    setMethod(selectedMethod);
    setStep('input');
    setError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setError('File size exceeds 2GB limit');
        return;
      }
      setUploadedFile(file);
      setError(null);
    }
  };

  const handleUrlValidation = async () => {
    if (!sourceUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(sourceUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsValidatingUrl(true);
    setError(null);

    // Simulate API call for clip extraction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock extracted clips
    const mockClips: ExtractedClip[] = [
      {
        id: '1',
        startTime: 120,
        endTime: 165,
        duration: 45,
        predictedRetention: 94,
        transcript: 'The secret to viral content is understanding the algorithm...',
      },
      {
        id: '2',
        startTime: 240,
        endTime: 285,
        duration: 45,
        predictedRetention: 91,
        transcript: 'Here is the framework that changed everything for my channel...',
      },
      {
        id: '3',
        startTime: 420,
        endTime: 465,
        duration: 45,
        predictedRetention: 88,
        transcript: 'Most creators make this one critical mistake...',
      },
      {
        id: '4',
        startTime: 540,
        endTime: 590,
        duration: 50,
        predictedRetention: 85,
        transcript: 'Let me show you exactly how to implement this today...',
      },
      {
        id: '5',
        startTime: 720,
        endTime: 765,
        duration: 45,
        predictedRetention: 82,
        transcript: 'The results speak for themselves when you apply this...',
      },
    ];

    setExtractedClips(mockClips);
    setIsValidatingUrl(false);
  };

  const handleCreateProject = async () => {
    if (!projectTitle.trim()) {
      setError('Please enter a project title');
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    // Simulate project creation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    router.push('/projects/1/edit');
  };

  const updateScript = (value: string) => {
    setAvatarScript(value);
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
    const estimatedSeconds = Math.ceil((wordCount / 130) * 60);
    setEstimatedDuration(estimatedSeconds);
  };

  const handleContinue = () => {
    if (method === 'upload' && !uploadedFile) {
      setError('Please upload a video file');
      return;
    }
    if (method === 'url' && extractedClips.length === 0) {
      handleUrlValidation();
      return;
    }
    if (method === 'avatar' && !avatarScript.trim()) {
      setError('Please enter a script');
      return;
    }
    setStep('details');
    setError(null);
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MethodCard
          icon={<Upload className="w-8 h-8" />}
          title="Upload Video"
          description="Upload your own video files to edit and enhance"
          features={['Drag & drop upload', 'Max 2GB per file', 'MP4, MOV, MKV supported']}
          onClick={() => handleMethodSelect('upload')}
        />
        <MethodCard
          icon={<Wand2 className="w-8 h-8" />}
          title="Magic Clips"
          description="Extract viral moments from long-form YouTube videos"
          features={['AI-powered extraction', 'Top 5 retention moments', 'Automatic transcription']}
          onClick={() => handleMethodSelect('url')}
          badge="Pro"
        />
        <MethodCard
          icon={<UserCircle className="w-8 h-8" />}
          title="AI Avatar"
          description="Create talking head videos from your script"
          features={['Photorealistic avatars', 'Multiple voice options', 'Script to video in <60s']}
          onClick={() => handleMethodSelect('avatar')}
          badge="Pro"
        />
      </div>
    </div>
  );

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border hover:border-text-muted rounded-card p-12 text-center transition-colors">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          id="video-upload"
        />
        <label htmlFor="video-upload" className="cursor-pointer block">
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-accent-green/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-accent-green" />
              </div>
              <div>
                <p className="font-medium text-text">{uploadedFile.name}</p>
                <p className="text-sm text-text-muted">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-surface-2 rounded-full flex items-center justify-center">
                <FileVideo className="w-8 h-8 text-text-muted" />
              </div>
              <div>
                <p className="font-medium text-text">Click to upload your video</p>
                <p className="text-sm text-text-muted mt-1">Or drag and drop</p>
              </div>
              <p className="text-xs text-text-muted">MP4, MOV, AVI, MKV up to 2GB</p>
            </div>
          )}
        </label>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('method')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!uploadedFile}>
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderMagicClipsStep = () => (
    <div className="space-y-6">
      {!extractedClips.length ? (
        <>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text">
              YouTube Video URL
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="pl-10"
                  disabled={isValidatingUrl}
                />
              </div>
              <Button
                onClick={handleUrlValidation}
                disabled={isValidatingUrl || !sourceUrl.trim()}
              >
                {isValidatingUrl ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Extract Clips
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-text-muted">
              Paste any YouTube video URL to extract the top 5 viral-worthy moments
            </p>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('method')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-text">Extracted Clips</h3>
              <Badge variant="success">{extractedClips.length} clips found</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extractedClips.map((clip) => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  isSelected={selectedClips.includes(clip.id)}
                  onToggle={() => {
                    setSelectedClips((prev) =>
                      prev.includes(clip.id)
                        ? prev.filter((id) => id !== clip.id)
                        : [...prev, clip.id]
                    );
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setExtractedClips([])}>
              Start Over
            </Button>
            <Button onClick={handleContinue} disabled={selectedClips.length === 0}>
              Continue ({selectedClips.length} selected)
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderAvatarStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Script
            </label>
            <textarea
              value={avatarScript}
              onChange={(e) => updateScript(e.target.value)}
              placeholder="Enter your script here. The avatar will speak these words..."
              className="w-full h-40 px-3 py-2 border border-border rounded-button bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text/20 resize-none"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
              <span>{avatarScript.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~{formatDuration(estimatedDuration)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Voice Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Default', 'Energetic', 'Calm', 'Professional'].map((voice) => (
                <button
                  key={voice}
                  onClick={() => setSelectedVoice(voice.toLowerCase())}
                  className={cn(
                    'px-4 py-2 rounded-button text-sm font-medium transition-colors flex items-center gap-2',
                    selectedVoice === voice.toLowerCase()
                      ? 'bg-text text-surface'
                      : 'bg-surface-2 text-text hover:bg-border'
                  )}
                >
                  <Mic className="w-4 h-4" />
                  {voice}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Select Avatar
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Alex', 'Sarah', 'Mike', 'Emma'].map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar.toLowerCase())}
                className={cn(
                  'p-4 rounded-card border-2 transition-all text-left',
                  selectedAvatar === avatar.toLowerCase()
                    ? 'border-text bg-surface-2'
                    : 'border-border hover:border-text-muted'
                )}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-green/30 to-accent-blue/30 mb-3 flex items-center justify-center text-lg font-display">
                  {avatar[0]}
                </div>
                <p className="font-medium text-text">{avatar}</p>
                <p className="text-xs text-text-muted">Professional</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('method')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!avatarScript.trim()}>
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Project Title *
          </label>
          <Input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Enter a title for your project"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Description
          </label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Optional description"
            className="w-full h-24 px-3 py-2 border border-border rounded-button bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text/20 resize-none"
          />
        </div>
      </div>

      <div className="bg-surface-2 rounded-card p-4">
        <h4 className="text-sm font-medium text-text mb-2">Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Method:</span>
            <span className="text-text capitalize">{method?.replace('-', ' ')}</span>
          </div>
          {method === 'upload' && uploadedFile && (
            <div className="flex justify-between">
              <span className="text-text-muted">File:</span>
              <span className="text-text">{uploadedFile.name}</span>
            </div>
          )}
          {method === 'url' && (
            <div className="flex justify-between">
              <span className="text-text-muted">Clips:</span>
              <span className="text-text">{selectedClips.length} selected</span>
            </div>
          )}
          {method === 'avatar' && (
            <div className="flex justify-between">
              <span className="text-text-muted">Duration:</span>
              <span className="text-text">~{formatDuration(estimatedDuration)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('input')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleCreateProject} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Spinner className="w-4 h-4 mr-2" />
              Creating...
            </>
          ) : (
            <>
              <Film className="w-4 h-4 mr-2" />
              Create Project
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 relative">
        <Spinner className="w-20 h-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Film className="w-8 h-8 text-text" />
        </div>
      </div>
      <h3 className="text-xl font-medium text-text mb-2">
        {method === 'avatar' ? 'Generating Avatar Video...' : 'Processing Video...'}
      </h3>
      <p className="text-text-muted max-w-md mx-auto">
        This may take a few moments. You'll be redirected to the editor when ready.
      </p>
    </div>
  );

  return (
    <>
      <Topbar title="New Project" />

      <div className="flex-1 p-6 overflow-auto">
        <PageHeader
          title="Create New Project"
          description="Choose how you want to create your video"
          backHref="/projects"
        />

        {error && (
          <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-card flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-accent-red flex-shrink-0" />
            <p className="text-sm text-accent-red">{error}</p>
          </div>
        )}

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>
              {step === 'method' && 'Choose Method'}
              {step === 'input' && method === 'upload' && 'Upload Video'}
              {step === 'input' && method === 'url' && 'Magic Clips'}
              {step === 'input' && method === 'avatar' && 'AI Avatar Studio'}
              {step === 'details' && 'Project Details'}
              {step === 'processing' && 'Processing'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 'method' && renderMethodSelection()}
            {step === 'input' && method === 'upload' && renderUploadStep()}
            {step === 'input' && method === 'url' && renderMagicClipsStep()}
            {step === 'input' && method === 'avatar' && renderAvatarStep()}
            {step === 'details' && renderDetailsStep()}
            {step === 'processing' && renderProcessingStep()}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

interface MethodCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  onClick: () => void;
  badge?: string;
}

function MethodCard({ icon, title, description, features, onClick, badge }: MethodCardProps) {
  return (
    <button
      onClick={onClick}
      className="p-6 rounded-card border border-border hover:border-text hover:shadow-card-hover transition-all text-left group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-button bg-surface-2 flex items-center justify-center text-text group-hover:bg-text group-hover:text-surface transition-colors">
          {icon}
        </div>
        {badge && (
          <Badge variant="warning" size="sm">
            {badge}
          </Badge>
        )}
      </div>
      <h3 className="text-lg font-medium text-text mb-2">{title}</h3>
      <p className="text-sm text-text-muted mb-4">{description}</p>
      <ul className="space-y-1">
        {features.map((feature, i) => (
          <li key={i} className="text-xs text-text-muted flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-accent-green" />
            {feature}
          </li>
        ))}
      </ul>
    </button>
  );
}

interface ClipCardProps {
  clip: ExtractedClip;
  isSelected: boolean;
  onToggle: () => void;
}

function ClipCard({ clip, isSelected, onToggle }: ClipCardProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'p-4 rounded-card border-2 transition-all text-left',
        isSelected
          ? 'border-accent-green bg-accent-green/5'
          : 'border-border hover:border-text-muted'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
            isSelected
              ? 'border-accent-green bg-accent-green'
              : 'border-border'
          )}
        >
          {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-text">
              {formatDuration(clip.startTime)} - {formatDuration(clip.endTime)}
            </span>
            <Badge variant="success" size="sm">
              {clip.predictedRetention}% retention
            </Badge>
          </div>
          <p className="text-xs text-text-muted line-clamp-2">{clip.transcript}</p>
          <p className="text-xs text-text-muted mt-1">{formatDuration(clip.duration)}</p>
        </div>
      </div>
    </button>
  );
}
