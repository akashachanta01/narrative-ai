import { Link } from "react-router-dom";
import databriefLogo from "@/assets/databrief-logo.png";
import { useCasePages, metricPages, comparisonPages } from "@/lib/seoData";

const FooterSection = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-6 max-w-5xl mx-auto font-sans">
        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">Solutions</h3>
            <ul className="space-y-2">
              {useCasePages.map((p) => (
                <li key={p.slug}>
                  <Link to={`/for/${p.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {p.industry}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">Learn</h3>
            <ul className="space-y-2">
              {metricPages.map((p) => (
                <li key={p.slug}>
                  <Link to={`/learn/${p.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {p.metric}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">Compare</h3>
            <ul className="space-y-2">
              {comparisonPages.map((p) => (
                <li key={p.slug}>
                  <Link to={`/compare/${p.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    vs {p.competitor}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
          <div className="flex items-center gap-2">
            <img src={databriefLogo} alt="DataBrief" className="w-7 h-7" />
            <span className="text-sm font-medium text-foreground">DataBrief</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 DataBrief</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
