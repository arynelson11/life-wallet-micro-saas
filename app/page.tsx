"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  Globe,
  LayoutDashboard,
  Shield,
  Zap,
  Star,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-primary shadow-lg shadow-primary/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">LifeWallet</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/dashboard">
              <Button className="bg-black text-white hover:bg-black/80 rounded-full px-6 h-10 font-medium shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm mb-8 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm font-medium text-zinc-600">New: AI Financial Assistant 2.0</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">
                Digital Wealth
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Experience the future of financial management. Seamlessly track, analyze, and grow your assets with our premium dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/dashboard">
                <Button className="h-14 px-8 rounded-full bg-black text-white hover:bg-zinc-800 text-lg font-medium shadow-xl shadow-black/10 transition-all hover:scale-105">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" className="h-14 px-8 rounded-full border-zinc-200 hover:bg-zinc-50 text-lg font-medium">
                View Demo
              </Button>
            </div>

            {/* Dashboard Preview */}
            <div className="mt-20 relative mx-auto max-w-6xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <div className="rounded-[2rem] overflow-hidden border border-zinc-200 shadow-2xl bg-white/50 backdrop-blur-sm p-2">
                <img
                  src="https://cdn.dribbble.com/userupload/13332476/file/original-d5c6b9f8f9f8f9f8f9f8f9f8f9f8f9f8.png?resize=1600x1200"
                  alt="Dashboard Preview"
                  className="rounded-[1.5rem] w-full h-auto object-cover"
                />
                {/* Fallback if image fails or for better context, we can use a div with our components later, but image is safer for landing page speed */}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-6 bg-zinc-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Everything you need. <br />
                <span className="text-zinc-400">Nothing you don't.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: LayoutDashboard,
                  title: "Smart Dashboard",
                  desc: "Visualize your entire financial life in one glance with our intuitive bento grid layout.",
                  color: "bg-primary text-black"
                },
                {
                  icon: Zap,
                  title: "Real-time Analytics",
                  desc: "Track spending patterns and income streams as they happen with millisecond precision.",
                  color: "bg-black text-primary"
                },
                {
                  icon: Shield,
                  title: "Bank-grade Security",
                  desc: "Your data is encrypted with AES-256 bit encryption. We prioritize your privacy above all.",
                  color: "bg-zinc-200 text-zinc-800"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-[2.5rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Simple Pricing
                </h2>
                <p className="text-xl text-muted-foreground">
                  Start for free, upgrade when you grow.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-full">
                <Button variant="ghost" className="rounded-full bg-white shadow-sm text-sm font-medium px-6">Monthly</Button>
                <Button variant="ghost" className="rounded-full text-zinc-500 text-sm font-medium px-6">Yearly (-20%)</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Tier */}
              <Card className="rounded-[2.5rem] border-zinc-200 shadow-sm p-2">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                  <CardDescription>For individuals just starting out.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="mb-8">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-4">
                    {["Basic Dashboard", "2 Wallets", "Manual Tracking"].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-zinc-600" />
                        </div>
                        <span className="text-zinc-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button variant="outline" className="w-full h-12 rounded-full font-semibold border-zinc-200">Get Started</Button>
                </CardFooter>
              </Card>

              {/* Pro Tier */}
              <Card className="rounded-[2.5rem] border-black shadow-xl bg-black text-white p-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="p-8 pb-0 relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                    <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
                  </div>
                  <CardDescription className="text-zinc-400">For power users who want more.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 relative z-10">
                  <div className="mb-8">
                    <span className="text-5xl font-bold">$29</span>
                    <span className="text-zinc-400">/mo</span>
                  </div>
                  <ul className="space-y-4">
                    {["Everything in Starter", "Unlimited Wallets", "AI Insights", "Priority Support"].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                        <span className="text-zinc-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0 relative z-10">
                  <Button className="w-full h-12 rounded-full font-bold bg-primary text-black hover:bg-primary/90">Upgrade to Pro</Button>
                </CardFooter>
              </Card>

              {/* Enterprise Tier */}
              <Card className="rounded-[2.5rem] border-zinc-200 shadow-sm p-2">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-2xl font-bold">Business</CardTitle>
                  <CardDescription>For teams and organizations.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="mb-8">
                    <span className="text-5xl font-bold">$99</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-4">
                    {["Everything in Pro", "Team Collaboration", "API Access", "Dedicated Account Manager"].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-zinc-600" />
                        </div>
                        <span className="text-zinc-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button variant="outline" className="w-full h-12 rounded-full font-semibold border-zinc-200">Contact Sales</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-20 px-6 rounded-t-[3rem]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold">LifeWallet</span>
                </div>
                <p className="text-zinc-400 max-w-sm">
                  The financial operating system for the modern web. Built for speed, designed for clarity.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6">Product</h4>
                <ul className="space-y-4 text-zinc-400">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6">Company</h4>
                <ul className="space-y-4 text-zinc-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
              <p>© 2025 LifeWallet Inc. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
