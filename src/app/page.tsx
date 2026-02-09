'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Search,
  Check,
  ArrowUpRight,
  Star,
  Menu,
  X
} from 'lucide-react';
import api from '@/lib/api';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Quintly" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter">Quintly</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">Pricing</a>
            <Link href="/login" className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="bg-white text-black text-xs font-black px-6 py-3 rounded-full uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">Get Started</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#050505] border-b border-white/5 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-5">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-white/60 hover:text-white">Features</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-white/60 hover:text-white">Pricing</a>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-white/60 hover:text-white">Login</Link>
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-white text-black text-xs font-black px-6 py-4 rounded-xl uppercase tracking-widest text-center">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-40 -z-10"
        >
          <div className="w-200 h-100 bg-primary/20 rounded-full blur-[160px] opacity-50" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">The World&apos;s Smartest Job Engine</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.85] uppercase">
            LAND YOUR <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-400 to-primary/80 animate-gradient italic">DREAM ROLE</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-white/60 mb-12 font-medium leading-relaxed italic">
            Stop applying blindly. Quintly scrapes the entire web and uses neural match technology to find the roles you&apos;re actually qualified for.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link
              href="/register"
              className="bg-primary text-white font-black px-12 py-6 rounded-4xl text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]"
            >
              Build Your Profile
              <ArrowUpRight className="w-6 h-6 " />
            </Link>
            <a
              href="#features"
              className="bg-white/5 border border-white/10 text-white font-black px-12 py-6 rounded-4xl text-lg hover:bg-white/10 transition-all backdrop-blur-xl"
            >
              Explore Intelligence
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 md:py-40">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Designed for the <br /><span className="text-primary italic">Top 1%</span> of Talent.</h2>
            <p className="text-white/50 text-xl font-medium">We don&apos;t just find jobs; we prepare you for them with cutting-edge AI insights and resume optimization.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Search className="w-10 h-10 text-primary" />}
            title="Hyper-Scraper"
            description="Access exclusive listings from Indeed, LinkedIn, and private job boards updated every millisecond."
          />
          <FeatureCard
            icon={<Sparkles className="w-10 h-10 text-indigo-400" />}
            title="Neural Match"
            description="Our proprietary LLM analyzes your unique skills against job requirements to give you a definitive match score."
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-yellow-400" />}
            title="Direct Export"
            description="Automatically optimize and export your resume as a clean PDF or DOCX tailored to any specific role."
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white/5 border-y border-white/5 py-20 md:py-40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8">Unleash the <span className="text-primary italic">Pro</span> Engine.</h2>
          <p className="text-white/60 mb-20 text-xl font-medium">Upgrade to Pro for unlimited AI analyses and premium export features.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Free Tier */}
            <div className="bg-[#0a0a0a] border border-white/10 p-12 rounded-[3rem] text-left">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/50 mb-4">The Candidate</h3>
              <div className="text-5xl font-black mb-8">Free</div>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <Check className="w-4 h-4 text-primary" />
                  Access to all scraped jobs
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <Check className="w-4 h-4 text-primary" />
                  5 AI match analyses per month
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-white/20 line-through">
                  Premium PDF/DOCX Export
                </li>
              </ul>
              <Link href="/register" className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-[#0a0a0a] border-2 border-primary p-12 rounded-[3rem] text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">Best Value</div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">The Engineer</h3>
              <div className="text-5xl font-black mb-8">₦5,000<span className="text-lg text-white/30 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <Check className="w-4 h-4 text-primary" />
                  Unlimited AI match analyses
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <Check className="w-4 h-4 text-primary" />
                  Infinite PDF/DOCX Exports
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-white/70">
                  <Check className="w-4 h-4 text-primary" />
                  Early access to new features
                </li>
              </ul>
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="block w-full text-center bg-primary hover:bg-primary/90 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/20"
              >
                {isLoading ? 'Initializing...' : 'Upgrade Now'}
              </button>
            </div>
          </div>

          <div className="mt-16 flex items-center justify-center gap-4">
            <img src="https://paystack.com/assets/img/v3/common/paystack-logo.svg" alt="Paystack" className="h-6 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Securely processed via Paystack</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Ch  ooJobs" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-sm font-black uppercase tracking-tighter">Quintly</span>
          </div>
          <p className="text-white/30 font-black uppercase tracking-widest text-[10px]">
            © 2026 CHOOJOBS ENGINEERING — ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.03)' }}
      className="group bg-transparent border border-white/5 p-10 rounded-[3rem] transition-all hover:border-white/10"
    >
      <div className="mb-8 p-5 bg-white/5 w-fit rounded-3xl transition-colors group-hover:bg-primary/20">
        {icon}
      </div>
      <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{title}</h3>
      <p className="text-white/40 font-medium leading-relaxed italic">{description}</p>
    </motion.div>
  );
}
