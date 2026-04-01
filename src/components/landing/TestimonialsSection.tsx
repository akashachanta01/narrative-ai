import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "DataBrief replaced three tools for us. We finally understand what's driving revenue without needing a data analyst.",
    name: "Sarah Chen",
    role: "Head of Growth",
    company: "Luminary",
    initials: "SC",
    avatarColor: "from-blue-500 to-violet-500",
    rating: 5,
  },
  {
    quote:
      "I used to spend hours in spreadsheets every Monday. Now I just open DataBrief and the weekly summary is already there.",
    name: "Marcus Rivera",
    role: "Founder",
    company: "Bolt Commerce",
    initials: "MR",
    avatarColor: "from-emerald-500 to-cyan-500",
    rating: 5,
  },
  {
    quote:
      "The AI insights caught a traffic drop from a broken UTM that would've taken us weeks to notice. Paid for itself day one.",
    name: "Priya Patel",
    role: "Marketing Lead",
    company: "Freshly",
    initials: "PP",
    avatarColor: "from-orange-500 to-pink-500",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const TestimonialsSection = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container px-6 max-w-5xl mx-auto">
        <motion.div
          className="mb-14 max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">
            What people say
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans">
            Trusted by teams who'd rather
            <br className="hidden sm:block" /> act than analyze
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="group relative p-6 rounded-2xl border border-border/50 bg-card flex flex-col hover:border-border hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* Large quote mark */}
              <div
                className="absolute top-4 right-5 text-5xl font-serif leading-none select-none pointer-events-none"
                style={{ color: "hsl(var(--border))", opacity: 0.6 }}
              >
                "
              </div>

              <StarRating count={t.rating} />

              <p className="text-sm text-foreground leading-relaxed mb-6 font-sans flex-1 relative z-10">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-sans">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom aggregate proof */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-3 font-sans">
            <div className="flex -space-x-2">
              {["from-blue-500 to-violet-500", "from-emerald-500 to-cyan-500", "from-orange-500 to-pink-500", "from-rose-500 to-pink-500"].map(
                (grad, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} border-2 border-background flex items-center justify-center`}
                  />
                )
              )}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                <span className="font-semibold text-foreground">4.9/5</span> from 500+ teams
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
