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

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

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
            <a href="#funcionalidades" className="hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#depoimentos" className="hover:text-foreground transition-colors">Depoimentos</a>
            <a href="#planos" className="hover:text-foreground transition-colors">Planos</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">
              Entrar
            </Link>
            <Link href="/dashboard">
              <Button className="bg-black text-white hover:bg-black/80 rounded-full px-6 h-10 font-medium shadow-lg hover:shadow-xl transition-all">
                Começar Agora
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
              <span className="text-sm font-medium text-zinc-600">Novo: Assistente Financeiro com IA 2.0</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Domine Sua <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">
                Liberdade Financeira
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Pare de sobreviver e comece a viver. O LifeWallet é o sistema definitivo para você organizar suas finanças, eliminar dívidas e construir riqueza real.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/dashboard">
                <Button className="h-14 px-8 rounded-full bg-black text-white hover:bg-zinc-800 text-lg font-medium shadow-xl shadow-black/10 transition-all hover:scale-105">
                  Teste Grátis por 7 Dias
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" className="h-14 px-8 rounded-full border-zinc-200 hover:bg-zinc-50 text-lg font-medium">
                Ver Demonstração
              </Button>
            </div>

            {/* Social Proof - Trust Badges */}
            <div className="mt-12 flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-sm text-zinc-500 font-medium">Junte-se a mais de 10.000 usuários que mudaram de vida</p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 pl-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">4.9/5</span>
                  <span className="text-zinc-500 text-sm">(2.4k avaliações)</span>
                </div>
              </div>
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
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="funcionalidades" className="py-32 px-6 bg-zinc-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Tudo o que você precisa. <br />
                <span className="text-zinc-400">Nada que você não use.</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Desenhado para ser simples, poderoso e direto ao ponto. Sem planilhas complexas, apenas resultados.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: LayoutDashboard,
                  title: "Painel Inteligente",
                  desc: "Visualize toda a sua vida financeira em um único lugar com nosso layout intuitivo Bento Grid.",
                  color: "bg-primary text-black"
                },
                {
                  icon: TrendingUp,
                  title: "Análise em Tempo Real",
                  desc: "Acompanhe seus gastos, receitas e metas evoluindo em tempo real. Saiba exatamente para onde vai seu dinheiro.",
                  color: "bg-black text-primary"
                },
                {
                  icon: Shield,
                  title: "Segurança Bancária",
                  desc: "Seus dados são criptografados com padrões militares (AES-256). Sua privacidade é nossa prioridade absoluta.",
                  color: "bg-zinc-200 text-zinc-800"
                },
                {
                  icon: Users,
                  title: "Gestão Familiar",
                  desc: "Compartilhe carteiras e metas com seu parceiro(a) ou família. Mantenha todos na mesma página.",
                  color: "bg-green-100 text-green-700"
                },
                {
                  icon: Zap,
                  title: "Automação",
                  desc: "Configure pagamentos recorrentes e nunca mais pague juros por atraso de boletos.",
                  color: "bg-yellow-100 text-yellow-700"
                },
                {
                  icon: Globe,
                  title: "Acesso Global",
                  desc: "Acesse suas finanças de qualquer lugar, em qualquer dispositivo. Seus dados sempre com você.",
                  color: "bg-blue-100 text-blue-700"
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

        {/* Testimonials */}
        <section id="depoimentos" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">O que dizem nossos membros</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Ricardo Silva",
                  role: "Empresário",
                  text: "O LifeWallet mudou completamente como eu vejo meu dinheiro. Antes eu não sabia para onde ia meu salário. Hoje tenho total controle.",
                  img: 15
                },
                {
                  name: "Juliana Costa",
                  role: "Freelancer",
                  text: "A simplicidade é o ponto forte. Tentei usar planilhas e outros apps, mas sempre desistia. O LifeWallet é viciante de usar.",
                  img: 25
                },
                {
                  name: "Marcelo e Ana",
                  role: "Casal",
                  text: "Usamos o plano Casal para organizar nossas contas conjuntas e metas de viagem. Nunca estivemos tão alinhados financeiramente.",
                  img: 65
                }
              ].map((t, i) => (
                <div key={i} className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100">
                  <div className="flex items-center gap-1 mb-4 text-yellow-400">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-lg text-zinc-700 mb-6 font-medium">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <img src={`https://i.pravatar.cc/100?img=${t.img}`} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="planos" className="py-32 px-6 bg-black text-white rounded-[3rem] mx-4 md:mx-10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Investimento Transparente
                </h2>
                <p className="text-xl text-zinc-400">
                  Escolha o plano ideal para o seu momento de vida.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-full border border-zinc-800">
                <Button
                  variant={isAnnual ? "ghost" : "secondary"}
                  onClick={() => setIsAnnual(false)}
                  className={`rounded-full px-6 transition-all ${!isAnnual ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                >
                  Mensal
                </Button>
                <Button
                  variant={isAnnual ? "secondary" : "ghost"}
                  onClick={() => setIsAnnual(true)}
                  className={`rounded-full px-6 transition-all ${isAnnual ? 'bg-primary text-black hover:bg-primary/90' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                >
                  Anual <span className="ml-2 text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white">-20%</span>
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Solteiro */}
              <Card className="rounded-[2.5rem] bg-zinc-900/50 border-zinc-800 text-zinc-100 backdrop-blur-sm">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-2xl font-bold">Solteiro</CardTitle>
                  <CardDescription className="text-zinc-400">Para quem quer organizar a própria vida.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">R$ {isAnnual ? "15,90" : "19,90"}</span>
                    <span className="text-zinc-500">/mês</span>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Painel de Controle Individual",
                      "Controle de Gastos e Ganhos",
                      "Metas Financeiras Ilimitadas",
                      "Importação de Extrato Bancário"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-zinc-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button variant="outline" className="w-full h-12 rounded-full font-semibold border-zinc-700 bg-transparent hover:bg-zinc-800 text-white hover:text-white">Começar Agora</Button>
                </CardFooter>
              </Card>

              {/* Casal */}
              <Card className="rounded-[2.5rem] border-primary shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)] bg-zinc-900 text-white p-2 relative overflow-hidden transform md:-translate-y-4">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary text-black font-bold flex items-center justify-center text-xs rotate-45 translate-x-8 -translate-y-8 z-20 shadow-lg">
                  MAIS VENDIDO
                </div>
                <CardHeader className="p-8 pb-0 relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <CardTitle className="text-3xl font-bold text-primary">Casal</CardTitle>
                  </div>
                  <CardDescription className="text-zinc-400">Perfeito para alinhar as finanças a dois.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 relative z-10">
                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-6xl font-bold">R$ {isAnnual ? "23,90" : "29,90"}</span>
                    <span className="text-zinc-400">/mês</span>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Tudo do plano Solteiro",
                      "Até 2 Usuários Conectados",
                      "Carteiras Compartilhadas",
                      "Metas em Conjunto",
                      "Suporte Prioritário por WhatsApp"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-black font-bold" />
                        </div>
                        <span className="text-white font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0 relative z-10">
                  <Button className="w-full h-14 rounded-full font-bold text-lg bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20">Quero o Plano Casal</Button>
                </CardFooter>
              </Card>

              {/* Família */}
              <Card className="rounded-[2.5rem] bg-zinc-900/50 border-zinc-800 text-zinc-100 backdrop-blur-sm">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-2xl font-bold">Família</CardTitle>
                  <CardDescription className="text-zinc-400">Educação financeira para todos.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">R$ {isAnnual ? "26,90" : "32,90"}</span>
                    <span className="text-zinc-500">/mês</span>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Tudo do plano Casal",
                      "Até 5 Usuários",
                      "Controle de Mesada",
                      "Relatórios Consolidados",
                      "Gestor de Conta Dedicado"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-zinc-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button variant="outline" className="w-full h-12 rounded-full font-semibold border-zinc-700 bg-transparent hover:bg-zinc-800 text-white hover:text-white">Assinar Plano Família</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Dúvidas Frequentes</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold">É seguro colocar meus dados?</AccordionTrigger>
                <AccordionContent className="text-zinc-600">
                  Sim, absolutamente. Utilizamos criptografia de ponta a ponta (AES-256), a mesma utilizada pelos grandes bancos. Nós não temos acesso às suas senhas bancárias e não vendemos seus dados para terceiros.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold">Posso cancelar quando quiser?</AccordionTrigger>
                <AccordionContent className="text-zinc-600">
                  Com certeza. No plano mensal, você pode cancelar a qualquer momento sem multa. No plano anual, você tem 7 dias de garantia incondicional para testar e pedir reembolso total se não gostar.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold">Como funciona o plano familiar?</AccordionTrigger>
                <AccordionContent className="text-zinc-600">
                  No plano familiar, você pode convidar até 4 outras pessoas (totalizando 5). Cada um tem seu acesso individual, mas vocês podem criar carteiras compartilhadas para despesas da casa, e o administrador pode ver relatórios consolidados da família.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold">Preciso inserir meus gastos manualmente?</AccordionTrigger>
                <AccordionContent className="text-zinc-600">
                  Você escolhe! O LifeWallet permite inserção manual super rápida, mas também oferecemos importação de extratos OFX e, em breve, integração automática via Open Finance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-zinc-50 border-t border-zinc-200 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold">LifeWallet</span>
                </div>
                <p className="text-zinc-500 max-w-sm">
                  O sistema operacional financeiro para a web moderna. Feito para velocidade, desenhado para clareza.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6">Produto</h4>
                <ul className="space-y-4 text-zinc-500">
                  <li><a href="#funcionalidades" className="hover:text-black transition-colors">Funcionalidades</a></li>
                  <li><a href="#planos" className="hover:text-black transition-colors">Preços</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Changelog</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Docs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6">Empresa</h4>
                <ul className="space-y-4 text-zinc-500">
                  <li><a href="#" className="hover:text-black transition-colors">Sobre</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Carreiras</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Contato</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
              <p>© 2025 LifeWallet Inc. Todos os direitos reservados.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-black transition-colors">Termos de Uso</a>
                <a href="#" className="hover:text-black transition-colors">Privacidade</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
