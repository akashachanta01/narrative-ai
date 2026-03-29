import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "DataBrief replaced three tools for us. We finally understand what's driving revenue without needing a data analyst.",
    name: "Sarah Chen",
    role: "Head of Growth, Luminary",
    initials: "SC",
  },
  {
    quote: "I used to spend hours in spreadsheets every Monday. Now I just open DataBrief and the weekly summary is already there.",
    name: "Marcus Rivera",
    role: "Founder, Bolt Commerce",
    initials: "MR",
  },
  {
    quote: "The AI insights caught a traffic drop from a broken UTM that would've taken us weeks to notice. Paid for itself day one.",
    name: "Priya Patel",
    role: "Marketing Lead, Freshly",
    initials: "PP",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-14 sm:py-18">
      <div className="container px-6 max-w-5xl mx-auto">
        <motion.div
          className="mb-10 max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">What people say</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans">
            Trusted by teams who'd rather act than analyze
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <p className="text-sm text-foreground leading-relaxed mb-6 font-sans">"{t.quote}"</p>
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold font-sans">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-sans">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-sans">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
