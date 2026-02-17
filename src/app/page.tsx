'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Search,
  Check,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import api from '@/lib/api';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/payment/initialize', {
        email: 'user@example.com', // In a real app, this comes from auth
        amount: 5000 // 5000 Naira for Pro
      });
      window.location.href = res.data.data.authorization_url;
    } catch (err) {
      console.error(err);
      alert('Subscription failed. Please log in first.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Quintly" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">Quintly</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Home</Link>
              <Link href="/jobs" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Browse Jobs</Link>
              <Link href="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Dashboard</Link>
              <Link href="#pricing" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Pricing</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
            <Link href="/register" className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background p-6 space-y-4 shadow-xl">
            <Link href="/" className="block text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/jobs" className="block text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>Browse Jobs</Link>
            <Link href="/dashboard" className="block text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link href="#pricing" className="block text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            <div className="pt-4 border-t border-border flex flex-col gap-4">
              <Link href="/login" className="text-center font-medium py-2">Login</Link>
              <Link href="/register" className="bg-primary text-primary-foreground text-center font-semibold py-3 rounded-lg">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Search Bar Overlay */}
        <div className="w-full max-w-3xl mb-16 relative">
          <div className="bg-card border border-border rounded-2xl p-2 shadow-2xl flex items-center gap-2 group focus-within:ring-2 ring-primary/20 transition-all">
            <div className="pl-4 text-foreground/40 group-focus-within:text-primary">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search job titles or keywords..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-foreground text-lg py-3 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
          {/* Subtle glow background */}
          <div className="absolute -inset-4 bg-primary/5 blur-3xl -z-10 rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
            Designed for the <br />
            <span className="text-primary">Top 1% of Talent</span>
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground font-medium mb-12">
            We don't just find jobs; we prepare you for them with cutting-edge AI insights and resume optimization.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Search className="w-6 h-6 text-white" />}
            title="Hyper-Scraper"
            description="Our advanced web scraper continuously monitors thousands of job boards, company sites, and hidden listings to find opportunities others miss."
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-white" />}
            title="Neural Match"
            description="AI-powered matching engine analyzes your skills, experience, and career goals to surface the most relevant opportunities with precision accuracy."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-white" />}
            title="Direct Export"
            description="Export optimized applications directly to ATS systems. One-click apply with tailored resumes and cover letters for each position."
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/30 py-24 px-6 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Unleash the <span className="text-primary font-bold">Pro Engine</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Upgrade to Pro for unlimited AI analyses and premium export features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-card border border-border p-10 rounded-3xl shadow-sm flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">The Candidate</span>
              <div className="text-5xl font-bold mb-6 italic">Free</div>
              <p className="text-muted-foreground mb-8 font-medium">Perfect for getting started</p>

              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm font-semibold">
                  <Check className="w-5 h-5 text-primary" />
                  10 AI match analyses per month
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold">
                  <Check className="w-5 h-5 text-primary" />
                  Basic job scraping
                </li>
              </ul>

              <Link href="/register" className="block text-center border border-border hover:bg-muted py-4 rounded-xl font-bold transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-primary text-primary-foreground p-10 rounded-3xl shadow-2xl relative flex flex-col scale-105 transform">
              <div className="absolute top-6 right-6 bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                Best Value
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-white/70 mb-4">The Engineer</span>
              <div className="text-5xl font-bold mb-6 italic">₦5,000<span className="text-xl font-normal opacity-70">/mo</span></div>
              <p className="text-white/80 mb-8 font-medium">For serious job seekers</p>

              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm font-semibold">
                  <Check className="w-5 h-5 text-white" />
                  Unlimited AI match analyses
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold">
                  <Check className="w-5 h-5 text-white" />
                  Advanced hyper-scraping
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold">
                  <Check className="w-5 h-5 text-white" />
                  Priority support
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold">
                  <Check className="w-5 h-5 text-white" />
                  Custom job alerts
                </li>
              </ul>

              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="block w-full bg-white text-primary hover:bg-neutral-100 py-4 rounded-xl font-bold transition-colors shadow-xl"
              >
                {isLoading ? 'Wait...' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">Quintly</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            © 2026 Quintly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-primary/5 hover:bg-primary/10 border border-primary/10 p-10 rounded-3xl transition-all group">
      <div className="mb-10 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-6 tracking-tight">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
    </div>
  );
}
