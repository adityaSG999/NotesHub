import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Zap, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Minimal Microblogging</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            Share Your Thoughts,
            <br />
            <span className="text-primary">One Note at a Time</span>
          </h1>
          
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            A clean, distraction-free space for sharing text-based notes, snippets, and short-form thoughts. No clutter, just content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium border border-outline hover:bg-surface transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Why NotesHub?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Fast & Simple"
              description="No complicated setup. Start sharing your thoughts in seconds."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Minimal Design"
              description="Clean interface focused on what matters - your content."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Community"
              description="Follow creators, discover content, and build your network."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Safe & Secure"
              description="Your data is protected with enterprise-grade security."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Ready to Start Sharing?
          </h2>
          <p className="text-text-secondary mb-8">
            Join thousands of users who are already sharing their thoughts on NotesHub.
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create Your Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-xl border border-outline bg-background hover:border-primary/50 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}
