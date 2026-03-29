import databriefLogo from "@/assets/databrief-logo.png";

const FooterSection = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={databriefLogo} alt="DataBrief" className="w-5 h-5" />
            <span className="text-sm font-medium text-foreground">DataBrief</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 DataBrief
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
