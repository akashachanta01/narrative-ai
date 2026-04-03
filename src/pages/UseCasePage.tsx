import { useParams, Link } from "react-router-dom";
import { useCasePages } from "@/lib/seoData";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, AlertTriangle } from "lucide-react";
import { Helmet } from "react-helmet-async";

const UseCasePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = useCasePages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <Button asChild><Link to="/">Go home</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={`https://databrief.ai/for/${page.slug}`} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:url" content={`https://databrief.ai/for/${page.slug}`} />
      </Helmet>

      <NavBar />
      <main className="pt-14">
        {/* Hero */}
        <section className="py-16 sm:py-24">
          <div className="container px-6 max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">
              AI Analytics for {page.industry}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5 text-foreground font-sans">
              {page.h1}
            </h1>
            <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto mb-8">
              {page.subtitle}
            </p>
            <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-sans" asChild>
              <Link to="/auth">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-12 sm:py-16 bg-secondary/40">
          <div className="container px-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 font-sans text-center">
              Sound familiar?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.painPoints.map((pain, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl border border-border/50 bg-card">
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground font-sans">{pain}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How DataBrief Helps */}
        <section className="py-12 sm:py-16">
          <div className="container px-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 font-sans text-center">
              How DataBrief helps
            </h2>
            <div className="space-y-4">
              {page.howDataBriefHelps.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-accent/15 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <p className="text-base text-foreground font-sans">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="py-12 sm:py-16 bg-secondary/40">
          <div className="container px-6 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-6 font-sans">
              Key metrics DataBrief tracks for {page.industry.toLowerCase()}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {page.metrics.map((metric, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm font-medium text-foreground font-sans">
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24">
          <div className="container px-6 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 font-sans">
              {page.cta}
            </h2>
            <p className="text-muted-foreground mb-8 font-sans">
              Free during early access. No credit card required.
            </p>
            <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-sans" asChild>
              <Link to="/auth">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default UseCasePage;
