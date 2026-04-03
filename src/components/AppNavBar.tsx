import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plug, LogOut, BarChart3 } from "lucide-react";
import databriefLogo from "@/assets/databrief-logo.png";

const ADMIN_EMAIL = "achantaa9@gmail.com";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Connections", path: "/connections", icon: Plug },
];

const ADMIN_NAV = { label: "Admin", path: "/admin", icon: BarChart3 };

export default function AppNavBar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/90">
      <div className="flex items-center justify-between h-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <img src={databriefLogo} alt="DataBrief" className="w-6 h-6" />
          <span className="text-sm font-semibold tracking-tight text-foreground hidden sm:inline">
            DataBrief
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* User + Sign out */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-muted-foreground hidden sm:inline truncate max-w-[140px]">
            {user.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
