import { useParams, Link } from "react-router-dom";
import { comparisonPages } from "@/lib/seoData";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ComparisonPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = comparisonPages.find((p) => p.slug === slug);

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
        <link rel="canonical" href={`https://databrief.ai/compare/${page.slug}`} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:url" content={`https://databrief.ai/compare/${page.slug}`} />
      </Helmet>

      <NavBar />
      <main className="pt-14">
        <section className="py-16 sm:py-24">
          <div className="container px-6 max-w-3xl mx-auto">
            <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">
              Comparison
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6 text-foreground font-sans">
              {page.h1}
            </h1>
            <p className="text-lg text-muted-foreground font-sans leading-relaxed mb-12">
              {page.intro}
            </p>

            {/* Comparison table */}
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              {/* Competitor */}
              <div className="rounded-xl border border-border/50 bg-card p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 font-sans">{page.competitor}</h2>
                <div className="space-y-3 mb-6">
                  {page.competitorPros.map((pro, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground font-sans">{pro}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {page.competitorCons.map((con, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground font-sans">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DataBrief */}
              <div className="rounded-xl border-2 border-accent/40 bg-accent/5 p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 font-sans">DataBrief</h2>
                <div className="space-y-3">
                  {page.databriefAdvantages.map((adv, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground font-sans">{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Best for */}
            <div className="p-6 rounded-xl bg-secondary/60 border border-border/50 mb-12">
              <h2 className="text-lg font-bold text-foreground mb-3 font-sans">Which should you choose?</h2>
              <p className="text-base text-muted-foreground font-sans leading-relaxed">{page.bestFor}</p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4 font-sans">
                Try DataBrief free — no credit card required
              </h2>
              <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-sans" asChild>
                <Link to="/auth">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default ComparisonPage;
