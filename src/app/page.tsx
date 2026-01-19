'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, Sparkles, Zap, ShieldCheck, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center justify-center gap-6 mb-8">
            <img src="/logo.png" alt="ChooJobs Logo" className="w-32 h-32 rounded-3xl shadow-2xl" />
            <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter">ChooJobs</h1>
          </div>

          <h2 className="text-6xl md:text-8xl font-black text-foreground mb-8 tracking-tighter leading-[0.9]">
            WE FIND IT. <br />
            <span className="text-primary italic">AI FITS IT.</span> <br />
            YOU LAND IT.
          </h2>

          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 font-medium italic">
            The next generation job marketplace. We scrape thousands of jobs and use advanced AI to tell you exactly how you match.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="group bg-primary text-white font-black px-10 py-5 rounded-2xl text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-2xl shadow-primary/30"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="bg-card border border-border text-foreground font-black px-10 py-5 rounded-2xl text-lg hover:bg-muted transition-all"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Search className="w-8 h-8 text-primary" />}
            title="Real-time Scraping"
            description="We scan Indeed, RemoteOK, and other top boards every hour to find the freshest opportunities."
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8 text-indigo-500" />}
            title="AI Match Analysis"
            description="Don't guess. Our AI compares your resume to the job description and gives you a match score."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8 text-emerald-500" />}
            title="Resume Optimization"
            description="Receive clear recommendations on how to tweak your resume for each specific job."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border mt-20 text-center">
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
          © 2026 ChooJobs Engineering — Powered by AI Semantics
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-card border border-border p-8 rounded-[2.5rem] transition-all"
    >
      <div className="mb-6 p-4 bg-muted w-fit rounded-2xl">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed italic">{description}</p>
    </motion.div>
  );
}
