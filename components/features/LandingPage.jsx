import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Zap, Shield } from 'lucide-react';
import Github from '@/components/icons/Github';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Minimal Microblogging</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 sm:mb-6 leading-tight">
            Share Your Thoughts,
            <br />
            <span className="text-primary">One Note at a Time</span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            A clean, distraction-free space for sharing text-based notes, snippets, and short-form thoughts. No clutter, just content.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-lg font-medium border border-outline hover:bg-surface transition-colors text-sm sm:text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-8 sm:mb-12">
            Why NotesHub?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <FeatureCard
              icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Fast & Simple"
              description="No complicated setup. Start sharing your thoughts in seconds."
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Minimal Design"
              description="Clean interface focused on what matters - your content."
            />
            <FeatureCard
              icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Community"
              description="Follow creators, discover content, and build your network."
            />
            <FeatureCard
              icon={<Shield className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Safe & Secure"
              description="Your data is protected with enterprise-grade security."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 sm:mb-4">
            Ready to Start Sharing?
          </h2>
          <p className="text-sm sm:text-base text-text-secondary mb-6 sm:mb-8 px-4">
            Join thousands of users who are already sharing their thoughts on NotesHub.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
          >
            Create Your Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* GitHub CTA Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-b from-surface to-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-surface-container to-surface border border-outline rounded-2xl p-6 sm:p-8 md:p-12 shadow-soft">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-surface rounded-2xl mb-4 sm:mb-6 shadow-sm">
              <Github className="w-6 h-6 sm:w-8 sm:h-8 text-text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2 sm:mb-3">
              Open Source & Free
            </h2>
            <p className="text-sm sm:text-base text-text-secondary mb-6 sm:mb-8 max-w-lg mx-auto px-4">
              NotesHub is open source and completely free. Check out our GitHub repository to contribute, report issues, or star the project.
            </p>
            <Link
              href="https://github.com/adityaSG999/NotesHub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-surface hover:bg-outline border border-outline text-text-primary px-5 sm:px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>View on GitHub</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-outline">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-text-muted">
            © 2026 NotesHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-4 sm:p-6 rounded-xl border border-outline bg-background hover:border-primary/50 transition-colors">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 sm:mb-4">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1.5 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
