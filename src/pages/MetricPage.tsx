import { useParams, Link } from "react-router-dom";
import { metricPages } from "@/lib/seoData";
import NavBar from "@/components/landing/NavBar";
import FooterSection from "@/components/landing/FooterSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

const MetricPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = metricPages.find((p) => p.slug === slug);

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `What is ${page.metric}?`, acceptedAnswer: { "@type": "Answer", text: page.definition } },
      { "@type": "Question", name: `Why does ${page.metric} matter?`, acceptedAnswer: { "@type": "Answer", text: page.whyItMatters } },
      { "@type": "Question", name: `How do you calculate ${page.metric}?`, acceptedAnswer: { "@type": "Answer", text: page.howToCalculate } },
      { "@type": "Question", name: `What is a good ${page.metric}?`, acceptedAnswer: { "@type": "Answer", text: page.goodBenchmark } },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={`https://databrief.ai/learn/${page.slug}`} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:url" content={`https://databrief.ai/learn/${page.slug}`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <NavBar />
      <main className="pt-14">
        <article className="py-16 sm:py-24">
          <div className="container px-6 max-w-3xl mx-auto">
            <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">
              Marketing Metrics
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-8 text-foreground font-sans">
              {page.h1}
            </h1>

            {/* Definition */}
            <div className="prose-section mb-10">
              <p className="text-lg text-foreground/90 font-sans leading-relaxed">
                {page.definition}
              </p>
            </div>

            {/* Why it matters */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-3 font-sans">
                Why {page.metric} matters
              </h2>
              <p className="text-base text-muted-foreground font-sans leading-relaxed">
                {page.whyItMatters}
              </p>
            </div>

            {/* How to calculate */}
            <div className="mb-10 p-6 rounded-xl bg-secondary/60 border border-border/50">
              <h2 className="text-xl font-bold text-foreground mb-3 font-sans">
                How to calculate {page.metric}
              </h2>
              <p className="text-base text-foreground font-sans font-mono leading-relaxed">
                {page.howToCalculate}
              </p>
            </div>

            {/* Benchmark */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-3 font-sans">
                What's a good {page.metric}?
              </h2>
              <p className="text-base text-muted-foreground font-sans leading-relaxed">
                {page.goodBenchmark}
              </p>
            </div>

            {/* How DataBrief helps */}
            <div className="mb-10 p-6 rounded-xl border-2 border-accent/30 bg-accent/5">
              <h2 className="text-xl font-bold text-foreground mb-3 font-sans">
                Track {page.metric} automatically with DataBrief
              </h2>
              <p className="text-base text-muted-foreground font-sans leading-relaxed mb-4">
                {page.howDataBriefHelps}
              </p>
              <Button className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-sans" asChild>
                <Link to="/auth">
                  Try DataBrief Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Related metrics */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3 font-sans">Related metrics</h2>
              <div className="flex flex-wrap gap-2">
                {page.relatedMetrics.map((m, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-secondary text-sm text-foreground font-sans">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <FooterSection />
    </div>
  );
};

export default MetricPage;
