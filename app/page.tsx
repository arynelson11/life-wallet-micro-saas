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
  TrendingUp,
  Users,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-lg shadow-primary/20 border border-primary/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">LifeWallet</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-zinc-400">
            <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary text-black hover:bg-primary/90 rounded-full px-6 h-10 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 px-4 md:pt-32 md:pb-32 md:px-6 overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-30" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10 opacity-20" />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-sm mb-8 animate-fade-in-up hover:bg-white/10 transition-colors cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#C7F33C]"></span>
              <span className="text-sm font-medium text-zinc-300">Novo: Assistente Financeiro com IA 2.0</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Domine Sua <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 drop-shadow-sm">
                Liberdade Financeira
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              O sistema operacional financeiro definitivo. Organize suas finanças, elimine dívidas e construa riqueza real com inteligência.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/dashboard" className="w-full md:w-auto">
                <Button className="w-full md:w-auto h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 text-lg font-bold shadow-xl shadow-white/10 transition-all hover:scale-105">
                  Teste Grátis Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" className="w-full md:w-auto h-14 px-8 rounded-full border-zinc-800 bg-black/50 hover:bg-zinc-900 text-white text-lg font-medium backdrop-blur-sm">
                Ver Demonstração
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-sm text-zinc-500 font-medium tracking-wide uppercase">Junte-se a elite financeira</p>
              <div className="flex items-center gap-4 p-2 pr-6 bg-zinc-900/50 rounded-full border border-zinc-800 backdrop-blur-md">
                <div className="flex -space-x-4 pl-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all z-0 hover:z-10 hover:scale-110">
                      <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 border-l border-zinc-700 pl-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <span className="font-bold text-white ml-2">4.9/5</span>
                </div>
              </div>
            </div>


            {/* Dashboard Preview */}
            <div className="mt-24 relative mx-auto max-w-6xl animate-fade-in-up group" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full z-0 group-hover:bg-primary/30 transition-all duration-1000" />
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-sm p-2 z-10 transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
                  alt="Dashboard Preview"
                  className="rounded-[1.5rem] w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                />

                {/* Overlay Gradient for smooth blend */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="funcionalidades" className="py-32 px-6 bg-zinc-950/50 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
                Poderoso. Simples. <br />
                <span className="text-zinc-500">Essencial.</span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Removemos toda a complexidade. Focamos apenas no que faz o seu dinheiro crescer.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: LayoutDashboard,
                  title: "Painel Bento Grid",
                  desc: "Visão holística de gastos, investimentos e metas em uma única tela.",
                  color: "bg-primary text-black"
                },
                {
                  icon: TrendingUp,
                  title: "Análise em Tempo Real",
                  desc: "Gráficos interativos que mostram exatamente para onde seu dinheiro está indo.",
                  color: "bg-zinc-800 text-white border border-zinc-700"
                },
                {
                  icon: Shield,
                  title: "Blindagem de Dados",
                  desc: "Criptografia militar AES-256. Seus dados são seus e de mais ninguém.",
                  color: "bg-zinc-800 text-white border border-zinc-700"
                },
                {
                  icon: Users,
                  title: "Modo Família",
                  desc: "Gerencie as finanças da casa em conjunto com carteiras compartilhadas.",
                  color: "bg-zinc-800 text-white border border-zinc-700"
                },
                {
                  icon: Zap,
                  title: "Automação Inteligente",
                  desc: "Esqueça datas de vencimento. O LifeWallet avisa e organiza para você.",
                  color: "bg-zinc-800 text-white border border-zinc-700"
                },
                {
                  icon: Globe,
                  title: "Universal",
                  desc: "Acesse via Web, Tablet ou Mobile. Sincronização instantânea.",
                  color: "bg-zinc-800 text-white border border-zinc-700"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800/50 hover:border-primary/50 hover:bg-zinc-900 transition-all duration-500 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="depoimentos" className="py-32 px-6 bg-black relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-white">Quem usa, enriquece.</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Roberta M.",
                  role: "Designer Sênior",
                  text: "Eu sempre terminava o mês no vermelho. Com o LifeWallet, consegui juntar R$ 15k em 6 meses. É bizarro de bom.",
                  img: 45
                },
                {
                  name: "Carlos E.",
                  role: "Desenvolvedor Software",
                  text: "A interface é muito superior aos apps de banco. Limpa, rápida e sem anúncios chatos. Vale cada centavo.",
                  img: 68
                },
                {
                  name: "Ana & Felipe",
                  role: "Plano Casal",
                  text: "Paramos de brigar por dinheiro. O plano casal alinhou nossas metas e agora estamos planejando nosso casamento com tranquilidade.",
                  img: 32
                }
              ].map((t, i) => (
                <div key={i} className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 hover:border-zinc-700 transition-all">
                  <div className="flex items-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-lg text-zinc-300 mb-8 font-medium italic leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <img src={`https://i.pravatar.cc/100?img=${t.img}`} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                    <div>
                      <p className="font-bold text-white">{t.name}</p>
                      <p className="text-sm text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="planos" className="py-32 px-4">
          <div className="max-w-7xl mx-auto bg-zinc-900 rounded-[3rem] p-8 md:p-20 relative overflow-hidden ring-1 ring-white/10">
            {/* Ambient Light */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                    Simples. Transparente.
                  </h2>
                  <p className="text-xl text-zinc-400">
                    Comece grátis, faça upgrade quando crescer.
                  </p>
                </div>

                {/* Toggle Anual/Mensal */}
                <div className="flex items-center gap-1 bg-black p-1.5 rounded-full border border-zinc-800">
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${!isAnnual ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Mensal
                  </button>
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-primary text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Anual <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">-20%</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Solteiro */}
                <Card className="rounded-[2.5rem] bg-black/50 border-zinc-800 text-zinc-100 backdrop-blur-sm hover:bg-black/80 transition-all">
                  <CardHeader className="p-8 pb-0">
                    <CardTitle className="text-2xl font-bold">Solteiro</CardTitle>
                    <CardDescription className="text-zinc-400 text-base">Controle individual.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="mb-8 flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-white">R$ {isAnnual ? "15,90" : "19,90"}</span>
                    </div>
                    <ul className="space-y-4">
                      {["Painel Individual", "Metas Ilimitadas", "Importação Bancária", "Suporte Básico"].map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-zinc-600" />
                          <span className="text-zinc-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <Button variant="outline" className="w-full h-12 rounded-full font-bold border-zinc-700 bg-transparent hover:bg-zinc-800 text-white">Escolher Plano</Button>
                  </CardFooter>
                </Card>

                {/* Casal - Destaque */}
                <Card className="rounded-[2.5rem] border-primary/50 shadow-[0_0_40px_-10px_rgba(199,243,60,0.2)] bg-black text-white p-1 relative overflow-hidden transform md:-translate-y-4">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                  <CardHeader className="p-8 pb-0 relative z-10">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-4 border border-primary/20">MAIS POPULAR</div>
                    <CardTitle className="text-3xl font-bold text-white">Casal</CardTitle>
                    <CardDescription className="text-zinc-400 text-base">Para construir juntos.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 relative z-10">
                    <div className="mb-8 flex items-baseline gap-1">
                      <span className="text-6xl font-bold text-primary">R$ {isAnnual ? "23,90" : "29,90"}</span>
                    </div>
                    <ul className="space-y-4">
                      {["Tudo do Solteiro", "2 Usuários", "Carteiras Compartilhadas", "Suporte VIP WhatsApp"].map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-black font-bold" />
                          </div>
                          <span className="text-white font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-8 pt-0 relative z-10">
                    <Button className="w-full h-14 rounded-full font-bold text-lg bg-primary text-black hover:bg-primary/90 hover:scale-105 transition-all">Começar Agora</Button>
                  </CardFooter>
                </Card>

                {/* Família */}
                <Card className="rounded-[2.5rem] bg-black/50 border-zinc-800 text-zinc-100 backdrop-blur-sm hover:bg-black/80 transition-all">
                  <CardHeader className="p-8 pb-0">
                    <CardTitle className="text-2xl font-bold">Família</CardTitle>
                    <CardDescription className="text-zinc-400 text-base">Até 5 pessoas.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="mb-8 flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-white">R$ {isAnnual ? "26,90" : "32,90"}</span>
                    </div>
                    <ul className="space-y-4">
                      {["Tudo do Casal", "Até 5 Usuários", "Gestão de Mesada", "Relatórios Consolidados"].map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-zinc-600" />
                          <span className="text-zinc-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <Button variant="outline" className="w-full h-12 rounded-full font-bold border-zinc-700 bg-transparent hover:bg-zinc-800 text-white">Escolher Plano</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-6 bg-black border-t border-zinc-900">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Dúvidas Frequentes</h2>
            <p className="text-zinc-500 text-center mb-12">Tudo o que você precisa saber, explicado.</p>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { q: "É seguro colocar meus dados?", a: "Sim, absolutamente. Utilizamos criptografia de ponta a ponta (AES-256), a mesma utilizada pelos grandes bancos. Nós não temos acesso às suas senhas bancárias." },
                { q: "Posso cancelar quando quiser?", a: "Com certeza. No plano mensal, você pode cancelar a qualquer momento sem multa. No anual, te damos 7 dias para testar." },
                { q: "Existe aplicativo para celular?", a: "O LifeWallet é um PWA (Progressive Web App). Você pode instalar no seu iPhone ou Android e usar como um app nativo, sem ocupar espaço na memória." },
                { q: "Como funciona a importação bancária?", a: "Aceitamos arquivos OFX que todos os bancos fornecem. Basta baixar do seu banco e arrastar para o LifeWallet. Em breve teremos conexão automática." }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-zinc-800 rounded-2xl px-6 bg-zinc-900/50">
                  <AccordionTrigger className="text-lg font-medium text-white hover:no-underline hover:text-primary transition-colors py-6">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 text-base pb-6 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-zinc-950 border-t border-zinc-900 py-20 px-6">
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
                  <span className="text-2xl font-bold text-white">LifeWallet</span>
                </div>
                <p className="text-zinc-500 max-w-sm leading-relaxed">
                  O sistema operacional financeiro para a web moderna. Feito para velocidade, desenhado para clareza e focado no seu crescimento.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-6">Produto</h4>
                <ul className="space-y-4 text-zinc-500">
                  <li><a href="#funcionalidades" className="hover:text-primary transition-colors">Funcionalidades</a></li>
                  <li><a href="#planos" className="hover:text-primary transition-colors">Preços</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-6">Legal</h4>
                <ul className="space-y-4 text-zinc-500">
                  <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-600">
              <p>© 2025 LifeWallet Inc. Todos os direitos reservados.</p>
              <div className="flex gap-4">
                <p>Feito com ⚡ em São Paulo</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
