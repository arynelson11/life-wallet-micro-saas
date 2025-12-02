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
  ArrowRightLeft,
  ArrowUp,
  BadgeCheck,
  Brain,
  Calendar,
  Check,
  ChevronRight,
  CreditCard,
  MessageCircle,
  Mic,
  Star,
  Tag,
  TrendingUp,
  Wallet,
  Smartphone,
  ArrowDown
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ios-blue rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-zinc-900">LifeWallet</span>
          </div>
          <Link href="/dashboard">
            <Button className="bg-ios-blue hover:bg-blue-600 text-white font-bold px-6 h-10 rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="px-6 pt-12 pb-20 md:pt-12 md:pb-24 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text */}
            <div className="text-center md:text-left order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 text-zinc-600 font-medium text-sm mb-6 shadow-sm animate-fade-in">
                <span className="text-yellow-500">⭐</span>
                Mais de 5.000 usuários confiam
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight mb-6 leading-[1.1]">
                Sua Vida Financeira no <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-ios-blue to-blue-600">
                  Piloto Automático.
                </span>
              </h1>
              <p className="text-xl text-zinc-500 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                Solteiro, Casal ou Família. O assistente que vive no seu WhatsApp e
                organiza tudo para você.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-14 px-8 rounded-full bg-ios-blue hover:bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                    Começar Agora
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-14 px-8 rounded-full border-zinc-200 text-zinc-700 font-semibold text-lg hover:bg-zinc-50"
                  >
                    Ver na Prática
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Mobile Mockup (Hidden on Mobile) */}
            <div className="hidden lg:flex relative order-1 md:order-2 justify-center perspective-1000">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-3xl rounded-full -z-10"></div>

              {/* Mobile Frame */}
              <div className="relative w-[300px] h-[600px] bg-zinc-900 rounded-[3rem] border-8 border-zinc-900 shadow-2xl z-20 transform -rotate-6 hover:rotate-0 transition-all duration-700 ease-out animate-float">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-30"></div>

                {/* Screen Content */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col relative">
                  {/* Status Bar */}
                  <div className="h-12 w-full bg-white flex items-center justify-between px-6 pt-2">
                    <span className="text-xs font-bold text-zinc-900">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2.5 bg-zinc-900 rounded-sm"></div>
                      <div className="w-0.5 h-2.5 bg-zinc-900 rounded-sm"></div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="px-6 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-zinc-100 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-2 w-24 bg-zinc-100 rounded mb-1"></div>
                        <div className="h-2 w-16 bg-zinc-100 rounded"></div>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-xs font-medium mb-1">Saldo Total</p>
                    <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">R$ 12.450,00</h3>
                  </div>

                  {/* Chart Area */}
                  <div className="h-32 w-full px-6 mb-6">
                    <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-blue-50 flex items-end justify-between p-4">
                      {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="w-2 bg-ios-blue rounded-t-full opacity-80"
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Transactions List */}
                  <div className="flex-1 bg-zinc-50 rounded-t-[2rem] p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-zinc-900">Transações</span>
                      <span className="text-xs text-blue-600 font-medium">Ver tudo</span>
                    </div>

                    {[
                      { title: "Salário", val: "+ R$ 5.000", icon: ArrowUp, color: "text-green-600", bg: "bg-green-100" },
                      { title: "Uber", val: "- R$ 24,90", icon: ArrowDown, color: "text-zinc-900", bg: "bg-zinc-200" },
                      { title: "Netflix", val: "- R$ 55,90", icon: ArrowDown, color: "text-zinc-900", bg: "bg-zinc-200" },
                      { title: "Mercado", val: "- R$ 450,00", icon: ArrowDown, color: "text-zinc-900", bg: "bg-zinc-200" },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-zinc-100">
                        <div className={`w-10 h-10 ${t.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <t.icon className={`w-5 h-5 ${t.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-zinc-900 text-sm">{t.title}</p>
                          <p className="text-xs text-zinc-400">Hoje</p>
                        </div>
                        <span className={`font-bold text-sm ${t.color.includes('green') ? 'text-green-600' : 'text-zinc-900'}`}>{t.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-24 bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Como Funciona
              </h2>
              <p className="text-zinc-500 text-lg">
                Simples como mandar um áudio.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Mic,
                  title: "Você fala",
                  desc: "Mande um áudio ou texto no WhatsApp contando seus gastos.",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  icon: Brain,
                  title: "A IA Organiza",
                  desc: "Nossa inteligência artificial categoriza e lança tudo automaticamente.",
                  color: "bg-purple-100 text-purple-600",
                },
                {
                  icon: TrendingUp,
                  title: "Você Cresce",
                  desc: "Receba insights, acompanhe metas e veja seu patrimônio evoluir.",
                  color: "bg-green-100 text-green-600",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-3xl shadow-apple border border-zinc-100 text-center hover:translate-y-[-4px] transition-transform duration-300"
                >
                  <div
                    className={`w-16 h-16 mx-auto ${item.color} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature 1: WhatsApp Power (Assistant) */}
        <section className="px-6 py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Chat Mockup (Floating Bubbles) - Hidden on Mobile */}
            <div className="hidden lg:flex relative mx-auto w-full max-w-[400px] order-2 md:order-1 h-[400px] flex-col justify-center">

              {/* Bubble 1 (User) */}
              <div className="self-end mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-green-500 text-white px-6 py-4 rounded-2xl rounded-tr-sm shadow-xl shadow-green-500/20 max-w-[280px] transform transition-all hover:scale-105">
                  <p className="text-lg font-medium">Gastei 50 no Uber</p>
                </div>
                <p className="text-xs text-zinc-400 text-right mt-2 mr-1">Você • 10:42</p>
              </div>

              {/* Bubble 2 (AI) */}
              <div className="self-start mb-6 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
                <div className="bg-white text-zinc-800 px-6 py-4 rounded-2xl rounded-tl-sm shadow-xl border border-zinc-100 max-w-[280px] flex items-center gap-3">
                  <div className="w-10 h-10 bg-ios-blue rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    LW
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">Anotado! ✅</p>
                    <p className="text-sm text-zinc-500">Categoria: Transporte</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 text-left mt-2 ml-1">LifeWallet • 10:42</p>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-green-50 to-blue-50 blur-3xl rounded-full -z-10"></div>
            </div>

            {/* Right: Text */}
            <div className="order-1 md:order-2 text-center md:text-left">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                Seu Assistente 24h
              </h2>
              <p className="text-xl text-zinc-500 leading-relaxed mb-8">
                Esqueça os aplicativos complicados. Com o LifeWallet, você gerencia tudo pelo WhatsApp. É tão natural quanto conversar com um amigo.
              </p>
              <ul className="space-y-4 text-left inline-block mb-8">
                {[
                  "Sem instalação de app extra",
                  "Envie áudios, textos ou fotos",
                  "Relatórios instantâneos",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center md:justify-start">
                <Link href="/dashboard">
                  <Button className="h-12 px-8 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg shadow-green-500/25">
                    Começar Agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Google Calendar */}
        <section className="px-6 py-24 bg-zinc-50 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="text-center md:text-left">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                Sincronia Perfeita com sua Agenda
              </h2>
              <p className="text-xl text-zinc-500 leading-relaxed mb-8">
                Nunca mais esqueça uma conta. Seus compromissos financeiros viram eventos na sua agenda automaticamente.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center gap-2 font-semibold text-zinc-700">
                  <span className="text-blue-500">G</span> Google Calendar
                </div>
                <ArrowRightLeft className="w-5 h-5 text-zinc-400" />
                <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center gap-2 font-semibold text-zinc-700">
                  <span className="text-green-500">W</span> WhatsApp
                </div>
              </div>
              <div className="flex justify-center md:justify-start">
                <Link href="/dashboard">
                  <Button variant="outline" className="h-12 px-8 rounded-full border-zinc-300 text-zinc-700 font-bold text-lg hover:bg-white hover:border-blue-500 hover:text-blue-600">
                    Sincronizar Agenda
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Mockup - Hidden on Mobile */}
            <div className="hidden lg:block relative mx-auto md:mr-0 max-w-[400px] w-full">
              <div className="bg-white rounded-3xl shadow-2xl border border-zinc-100 p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-zinc-900">Novembro 2024</h3>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-100"></div>
                    <div className="w-8 h-8 rounded-full bg-zinc-100"></div>
                  </div>
                </div>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4 text-center text-xs font-medium text-zinc-400">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-zinc-700">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                    const isBill = [5, 15, 25].includes(day);
                    return (
                      <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-lg ${isBill ? 'bg-red-50 text-red-600 border border-red-100' : 'hover:bg-zinc-50'}`}>
                        <span>{day}</span>
                        {isBill && <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1"></div>}
                      </div>
                    )
                  })}
                </div>
                {/* Event Card */}
                <div className="mt-6 bg-red-50 rounded-xl p-4 border border-red-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                    25
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">Vencimento Cartão</p>
                    <p className="text-sm text-red-600">R$ 2.340,00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof: Stats */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Números que Comprovam
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "+150k", label: "Transações" },
                { value: "R$ 10 mi", label: "Gerenciados" },
                { value: "99%", label: "Precisão da IA" },
                { value: "4.9/5", label: "Avaliação" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-ios-blue mb-2">
                    {stat.value}
                  </div>
                  <p className="text-zinc-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof: Testimonials */}
        <section className="px-6 py-24 bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Quem usa, ama
              </h2>
              <p className="text-zinc-500 text-lg">
                Veja o que nossos clientes estão dizendo.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Carolina Silva",
                  text: "Mudou minha vida financeira completamente! Antes eu não tinha controle nenhum, agora sei exatamente para onde vai cada centavo. Melhor decisão que eu tomei.",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                },
                {
                  name: "Rodrigo & Mariana",
                  text: "Finalmente meu marido e eu paramos de brigar por dinheiro. Tudo visível, tudo organizado. O LifeWallet trouxe paz para nossa casa!",
                  avatar: "https://images.unsplash.com/photo-1542596594-649edbc13630?w=150",
                },
                {
                  name: "Felipe Santos",
                  text: "Simples demais! Não preciso abrir nenhum app chato. Só mando mensagem no WhatsApp e pronto. Meu contador adorou os relatórios.",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-8 shadow-apple border border-zinc-100 hover:shadow-apple-lg transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div>
                      <p className="font-bold text-zinc-900">
                        {testimonial.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <BadgeCheck className="w-4 h-4" />
                        Cliente Verificado
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-zinc-600 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Planos para todos os momentos
              </h2>
              <p className="text-zinc-500 text-lg">
                Comece grátis e evolua conforme sua necessidade.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Solo Plan */}
              <Card className="rounded-3xl border-zinc-200 shadow-apple hover:shadow-apple-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-zinc-900">
                    Solo
                  </CardTitle>
                  <CardDescription>Para quem está começando.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-zinc-900">
                      R$ 19,90
                    </span>
                    <span className="text-zinc-500">/mês</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Integração WhatsApp",
                      "Dashboard Básico",
                      "Até 5 Metas",
                      "Suporte por Email",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-zinc-600">
                        <Check className="w-5 h-5 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full rounded-full font-semibold" variant="outline">
                      Escolher Solo
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Casal Plan (Highlight) */}
              <Card className="relative rounded-3xl border-ios-blue shadow-apple-lg scale-105 z-10 bg-white ring-4 ring-blue-50">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ios-blue text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Mais Escolhido
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-zinc-900">
                    Casal
                  </CardTitle>
                  <CardDescription>Para construir sonhos juntos.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-zinc-900">
                      R$ 29,90
                    </span>
                    <span className="text-zinc-500">/mês</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Tudo do Solo",
                      "2 Contas WhatsApp",
                      "Metas Compartilhadas",
                      "Dashboard Unificado",
                      "Relatórios Avançados",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-zinc-600">
                        <Check className="w-5 h-5 text-ios-blue" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full rounded-full bg-ios-blue hover:bg-blue-600 font-bold h-12 shadow-lg shadow-blue-500/20">
                      Escolher Casal
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Família Plan */}
              <Card className="rounded-3xl border-zinc-200 shadow-apple hover:shadow-apple-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-zinc-900">
                    Família
                  </CardTitle>
                  <CardDescription>Gestão completa para todos.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-zinc-900">
                      R$ 59,90
                    </span>
                    <span className="text-zinc-500">/mês</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Tudo do Casal",
                      "Até 5 Membros",
                      "Controle de Mesada",
                      "Consultoria Mensal",
                      "Suporte Prioritário",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-zinc-600">
                        <Check className="w-5 h-5 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full rounded-full font-semibold" variant="outline">
                      Escolher Família
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-zinc-50 border-t border-zinc-200 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-zinc-300 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">L</span>
              </div>
              <span className="font-bold text-zinc-700">LifeWallet</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-500 font-medium">
              <a href="#" className="hover:text-zinc-900">Termos de Uso</a>
              <a href="#" className="hover:text-zinc-900">Privacidade</a>
              <a href="#" className="hover:text-zinc-900">Instagram</a>
              <a href="#" className="hover:text-zinc-900">Twitter</a>
            </div>
            <p className="text-sm text-zinc-400">
              © 2024 LifeWallet. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
