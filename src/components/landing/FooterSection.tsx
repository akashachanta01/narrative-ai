import databriefLogo from "@/assets/databrief-logo.png";

const FooterSection = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={databriefLogo} alt="DataBrief" className="w-6 h-6" />
          <span className="text-sm font-medium">DataBrief</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 DataBrief. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
