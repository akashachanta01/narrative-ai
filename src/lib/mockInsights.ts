import { Zap, TrendingUp, TrendingDown, ShoppingCart, BarChart3, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface InsightCard {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  metric: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  narrative: string;
  source: string;
}

export const mockInsights: InsightCard[] = [
  {
    id: "1",
    icon: ShoppingCart,
    iconColor: "text-orange-500",
    metric: "Checkout Dropoff",
    value: "34%",
    change: "+8% vs last week",
    changeType: "up",
    narrative:
      "Your checkout abandonment spiked after Tuesday's shipping cost update. Customers are adding items but leaving when they see the new $7.99 flat rate — consider offering free shipping over $50 to recover conversions.",
    source: "Shopify",
  },
  {
    id: "2",
    icon: TrendingDown,
    iconColor: "text-red-500",
    metric: "Organic Traffic",
    value: "2,140",
    change: "-12% vs last week",
    changeType: "down",
    narrative:
      "Google's latest core update on Monday reshuffled rankings for your top 3 blog posts. Your 'Best Running Shoes 2025' article dropped from position 4 to 11 — update it with fresh reviews to regain visibility.",
    source: "Google Analytics",
  },
  {
    id: "3",
    icon: Zap,
    iconColor: "text-primary",
    metric: "Ad Spend ROI",
    value: "3.2x",
    change: "+0.4x vs last week",
    changeType: "up",
    narrative:
      "Your retargeting campaign on Instagram is outperforming cold audiences by 2x. Shift 20% of your Facebook cold-audience budget to Instagram retargeting to maximize returns this week.",
    source: "Google Ads",
  },
];
