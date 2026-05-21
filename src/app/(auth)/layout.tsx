import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-text flex-col justify-between p-12">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
              <Zap className="w-6 h-6 text-text" />
            </div>
            <span className="font-display text-2xl font-medium text-surface">
              YTShortsPro
            </span>
          </Link>
        </div>

        <div className="max-w-md">
          <blockquote className="text-xl text-surface/90 font-display leading-relaxed">
            "The only platform that combines professional-grade video production with real-time algorithmic intelligence."
          </blockquote>
          <p className="mt-4 text-surface/60">
            Join thousands of creators who are growing their channels with AI-powered tools.
          </p>
        </div>

        <div className="text-surface/40 text-sm">
          © 2026 YTShortsPro. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-bg">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
