// Programmatic SEO data for DataBrief

export interface UseCasePage {
  slug: string;
  industry: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  painPoints: string[];
  howDataBriefHelps: string[];
  metrics: string[];
  cta: string;
}

export interface MetricPage {
  slug: string;
  metric: string;
  title: string;
  metaDescription: string;
  h1: string;
  definition: string;
  whyItMatters: string;
  howToCalculate: string;
  goodBenchmark: string;
  howDataBriefHelps: string;
  relatedMetrics: string[];
}

export interface ComparisonPage {
  slug: string;
  competitor: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  competitorPros: string[];
  competitorCons: string[];
  databriefAdvantages: string[];
  bestFor: string;
}

export const useCasePages: UseCasePage[] = [
  {
    slug: "ecommerce",
    industry: "E-commerce",
    title: "AI Analytics for E-commerce | DataBrief",
    metaDescription: "DataBrief turns your e-commerce data into plain-English insights. Connect Shopify, GA4, and Stripe to get daily AI briefs on revenue, ROAS, and conversions.",
    h1: "AI analytics for e-commerce brands",
    subtitle: "Stop digging through Shopify dashboards. Get a daily AI brief on what's driving revenue and what needs fixing.",
    painPoints: [
      "Spending hours in Shopify analytics without clear takeaways",
      "Missing revenue drops until it's too late",
      "Can't connect the dots between ad spend and actual sales",
      "Too many dashboards, not enough answers",
    ],
    howDataBriefHelps: [
      "Daily AI-generated briefs summarize your store's performance in plain English",
      "Automatic alerts when revenue, ROAS, or conversion rates change significantly",
      "Connects Shopify, GA4, and Stripe data in one place via Windsor.ai",
      "Actionable recommendations — not just charts, but what to do next",
    ],
    metrics: ["Revenue", "ROAS", "Conversion Rate", "Average Order Value", "Sessions", "Cart Abandonment"],
    cta: "Get your first e-commerce AI brief in under 2 minutes",
  },
  {
    slug: "saas",
    industry: "SaaS",
    title: "AI Analytics for SaaS Companies | DataBrief",
    metaDescription: "DataBrief helps SaaS companies track signups, trial conversions, and marketing ROI with AI-powered plain-English insights. No SQL required.",
    h1: "AI analytics for SaaS companies",
    subtitle: "Know exactly which channels drive signups and what's affecting your trial-to-paid conversion — without writing a single query.",
    painPoints: [
      "Can't tell which marketing channels actually drive paid conversions",
      "Reporting takes hours of manual data pulling every week",
      "Metrics are scattered across GA4, Stripe, and internal tools",
      "Non-technical team members can't access data insights",
    ],
    howDataBriefHelps: [
      "AI briefs highlight which channels are driving the most valuable traffic",
      "Automatic performance summaries replace manual weekly reports",
      "Unified view of GA4 traffic and Stripe revenue data",
      "Plain-English insights anyone on the team can understand",
    ],
    metrics: ["Signups", "Trial-to-Paid Rate", "MRR", "CAC", "Sessions by Source", "Churn Indicators"],
    cta: "Get AI-powered SaaS analytics in 2 minutes",
  },
  {
    slug: "agencies",
    industry: "Marketing Agencies",
    title: "AI Analytics for Marketing Agencies | DataBrief",
    metaDescription: "DataBrief gives marketing agencies AI-powered client reports in plain English. Connect GA4, Shopify, and Stripe to automate client insights.",
    h1: "AI analytics for marketing agencies",
    subtitle: "Automate client reporting with AI-generated insights. Spend less time on dashboards and more time on strategy.",
    painPoints: [
      "Building client reports takes hours every week",
      "Clients want simple answers, not complex dashboards",
      "Managing multiple GA4 properties is overwhelming",
      "Hard to spot underperforming campaigns across clients",
    ],
    howDataBriefHelps: [
      "AI-generated daily briefs for each client — ready to share or act on",
      "Plain-English insights clients actually understand",
      "Connect multiple data sources per client via Windsor.ai",
      "Smart alerts flag issues before clients notice them",
    ],
    metrics: ["Sessions", "ROAS", "Revenue", "Bounce Rate", "Conversion Rate", "Cost per Acquisition"],
    cta: "Automate your agency reporting with AI",
  },
  {
    slug: "startups",
    industry: "Startups",
    title: "AI Analytics for Startups | DataBrief",
    metaDescription: "DataBrief gives startups AI-powered analytics without a data team. Connect GA4 and get plain-English insights on growth, traffic, and conversions.",
    h1: "AI analytics for startups",
    subtitle: "You don't need a data team. DataBrief turns your GA4 data into actionable growth insights automatically.",
    painPoints: [
      "No dedicated data analyst to interpret metrics",
      "Founders spend too much time in Google Analytics",
      "Growth bottlenecks go unnoticed for weeks",
      "Limited budget for expensive BI tools",
    ],
    howDataBriefHelps: [
      "AI acts as your personal data analyst — briefs delivered daily",
      "Immediate alerts when key metrics shift unexpectedly",
      "Free during early access — perfect for bootstrapped startups",
      "Set up in 2 minutes with just a Windsor.ai API key",
    ],
    metrics: ["Daily Active Users", "Signup Rate", "Traffic Sources", "Bounce Rate", "Conversion Funnel", "Revenue"],
    cta: "Get startup-grade analytics for free",
  },
  {
    slug: "content-creators",
    industry: "Content Creators",
    title: "AI Analytics for Content Creators | DataBrief",
    metaDescription: "DataBrief helps content creators understand what's working with AI-powered traffic and engagement insights. No analytics expertise needed.",
    h1: "AI analytics for content creators",
    subtitle: "Understand which content drives traffic and revenue — explained in plain English, not charts.",
    painPoints: [
      "Google Analytics is overwhelming and hard to navigate",
      "No way to quickly see which content performs best",
      "Can't connect content performance to actual revenue",
      "Spend more time analyzing than creating",
    ],
    howDataBriefHelps: [
      "Daily AI briefs tell you which content is driving results",
      "Automatic alerts when traffic patterns change",
      "Simple, plain-English insights — no analytics degree required",
      "Connect GA4 in minutes and start getting insights immediately",
    ],
    metrics: ["Pageviews", "Top Landing Pages", "Traffic Sources", "Engagement Rate", "Revenue per Page", "Returning Visitors"],
    cta: "See what your content is really doing",
  },
  {
    slug: "dropshipping",
    industry: "Dropshipping",
    title: "AI Analytics for Dropshipping | DataBrief",
    metaDescription: "DataBrief helps dropshippers track ROAS, ad performance, and revenue with AI insights. Connect Shopify and GA4 for automated daily briefs.",
    h1: "AI analytics for dropshipping stores",
    subtitle: "Stop guessing which products and ads are profitable. DataBrief gives you a daily AI verdict on your store's performance.",
    painPoints: [
      "Hard to track true ROAS across multiple ad platforms",
      "Profitable products get buried in Shopify reports",
      "Revenue spikes and drops happen without warning",
      "Too many numbers, not enough clarity on what to do",
    ],
    howDataBriefHelps: [
      "AI identifies your most and least profitable traffic sources",
      "Daily briefs highlight revenue trends and anomalies",
      "Connect Shopify + GA4 data for a unified performance view",
      "Actionable recommendations tell you exactly what to change",
    ],
    metrics: ["ROAS", "Revenue by Source", "Conversion Rate", "Average Order Value", "Ad Spend Efficiency", "Sessions"],
    cta: "Get daily AI insights for your dropshipping store",
  },
];

export const metricPages: MetricPage[] = [
  {
    slug: "what-is-roas",
    metric: "ROAS",
    title: "What is ROAS? Return on Ad Spend Explained | DataBrief",
    metaDescription: "Learn what ROAS (Return on Ad Spend) is, how to calculate it, and what a good ROAS looks like. DataBrief tracks ROAS automatically with AI insights.",
    h1: "What is ROAS (Return on Ad Spend)?",
    definition: "ROAS (Return on Ad Spend) measures how much revenue you earn for every dollar spent on advertising. It's one of the most important metrics for evaluating the profitability of your marketing campaigns.",
    whyItMatters: "ROAS tells you whether your ad campaigns are making or losing money. A high ROAS means your ads are efficient; a low ROAS means you're spending more than you're earning. Without tracking ROAS, you're essentially flying blind with your ad budget.",
    howToCalculate: "ROAS = Revenue from Ads ÷ Cost of Ads. For example, if you spent $1,000 on ads and generated $5,000 in revenue, your ROAS is 5x (or 500%).",
    goodBenchmark: "A good ROAS varies by industry, but generally a 4x ROAS (earning $4 for every $1 spent) is considered healthy for e-commerce. Some industries aim for 3x, while high-margin products can sustain a 2x ROAS.",
    howDataBriefHelps: "DataBrief automatically calculates and tracks your ROAS across all connected sources. When your ROAS drops below your benchmark, you'll get an AI-powered alert with specific recommendations on what to adjust.",
    relatedMetrics: ["CAC", "Conversion Rate", "Revenue", "CPC"],
  },
  {
    slug: "what-is-conversion-rate",
    metric: "Conversion Rate",
    title: "What is Conversion Rate? How to Calculate & Improve It | DataBrief",
    metaDescription: "Learn what conversion rate is, how to calculate it, and proven strategies to improve it. DataBrief tracks conversion rates with AI-powered insights.",
    h1: "What is Conversion Rate?",
    definition: "Conversion rate is the percentage of visitors who complete a desired action on your website — whether that's making a purchase, signing up for a trial, or filling out a form.",
    whyItMatters: "Your conversion rate directly impacts revenue. Doubling your conversion rate has the same effect as doubling your traffic, but it's usually much cheaper and faster to achieve. It's the single most important metric for optimizing your funnel.",
    howToCalculate: "Conversion Rate = (Number of Conversions ÷ Total Visitors) × 100. For example, if 50 out of 1,000 visitors made a purchase, your conversion rate is 5%.",
    goodBenchmark: "Average e-commerce conversion rates are 2-3%. Top-performing stores achieve 5%+. For SaaS, free trial signup rates of 3-7% are common, while trial-to-paid rates of 15-25% are considered good.",
    howDataBriefHelps: "DataBrief monitors your conversion rate daily and alerts you when it changes significantly. The AI identifies which traffic sources have the highest and lowest conversion rates, helping you focus your budget on what works.",
    relatedMetrics: ["Bounce Rate", "Sessions", "Revenue", "Average Order Value"],
  },
  {
    slug: "what-is-bounce-rate",
    metric: "Bounce Rate",
    title: "What is Bounce Rate? Understanding & Reducing It | DataBrief",
    metaDescription: "Learn what bounce rate means, why it matters for your website, and how to reduce it. DataBrief monitors bounce rate with AI-powered alerts.",
    h1: "What is Bounce Rate?",
    definition: "Bounce rate is the percentage of visitors who land on your website and leave without interacting further — no clicks, no page views, no conversions. They 'bounce' away after seeing just one page.",
    whyItMatters: "A high bounce rate often signals a mismatch between what visitors expect and what they find. It can indicate poor page load speed, irrelevant content, bad UX, or misaligned ad targeting. Reducing bounce rate means more visitors engage with your site.",
    howToCalculate: "Bounce Rate = (Single-page Sessions ÷ Total Sessions) × 100. In GA4, this is calculated as sessions where engagement duration was less than 10 seconds with no conversion events or additional page views.",
    goodBenchmark: "Average bounce rates vary: landing pages (60-90%), blogs (65-80%), e-commerce product pages (20-45%), SaaS homepages (25-50%). Context matters — a high bounce rate on a single-purpose page (like a contact form) may be perfectly fine.",
    howDataBriefHelps: "DataBrief tracks your bounce rate across traffic sources and pages. When bounce rate spikes, you'll get an AI alert explaining which source or page is affected and what might be causing it.",
    relatedMetrics: ["Session Duration", "Pages per Session", "Engagement Rate", "Exit Rate"],
  },
  {
    slug: "what-is-cac",
    metric: "Customer Acquisition Cost",
    title: "What is CAC? Customer Acquisition Cost Explained | DataBrief",
    metaDescription: "Learn what Customer Acquisition Cost (CAC) is, how to calculate it, and how to lower it. DataBrief tracks CAC automatically with AI analytics.",
    h1: "What is Customer Acquisition Cost (CAC)?",
    definition: "Customer Acquisition Cost (CAC) is the total cost of acquiring a new customer, including all marketing and sales expenses. It tells you how efficiently your business turns marketing spend into paying customers.",
    whyItMatters: "CAC determines whether your growth is sustainable. If it costs more to acquire a customer than they'll ever spend with you, your business model is broken. Understanding CAC helps you allocate budget to the most efficient channels.",
    howToCalculate: "CAC = Total Sales & Marketing Costs ÷ Number of New Customers Acquired. Include ad spend, salaries, tools, and any other costs directly tied to customer acquisition.",
    goodBenchmark: "Healthy CAC depends on your customer lifetime value (LTV). A general rule: your LTV:CAC ratio should be at least 3:1. For e-commerce, CAC under $30-50 is common; for SaaS, it varies widely based on ACV.",
    howDataBriefHelps: "DataBrief connects your ad spend data with revenue and conversion data to estimate CAC by channel. The AI highlights which channels have the lowest CAC and where you're overspending.",
    relatedMetrics: ["LTV", "ROAS", "Conversion Rate", "Revenue per User"],
  },
  {
    slug: "what-is-average-order-value",
    metric: "Average Order Value",
    title: "What is Average Order Value (AOV)? How to Increase It | DataBrief",
    metaDescription: "Learn what Average Order Value is, how to calculate AOV, and strategies to increase it. DataBrief monitors AOV trends with AI-powered insights.",
    h1: "What is Average Order Value (AOV)?",
    definition: "Average Order Value (AOV) is the average amount a customer spends per transaction on your website. It's a key metric for understanding purchasing behavior and revenue efficiency.",
    whyItMatters: "Increasing AOV is one of the fastest ways to grow revenue without needing more traffic. Small improvements in AOV — through upsells, bundles, or free shipping thresholds — can have a massive impact on profitability.",
    howToCalculate: "AOV = Total Revenue ÷ Number of Orders. For example, if your store generated $10,000 from 200 orders, your AOV is $50.",
    goodBenchmark: "AOV varies dramatically by industry: fashion ($50-100), electronics ($100-300), luxury goods ($200+), food & beverage ($25-50). Compare against your own historical data rather than industry averages.",
    howDataBriefHelps: "DataBrief tracks your AOV trends over time and by traffic source. When AOV drops or a specific channel brings in lower-value orders, the AI alerts you with context on what changed.",
    relatedMetrics: ["Revenue", "Conversion Rate", "Items per Order", "Customer Lifetime Value"],
  },
  {
    slug: "what-is-session-duration",
    metric: "Session Duration",
    title: "What is Session Duration? Why It Matters for SEO & UX | DataBrief",
    metaDescription: "Learn what session duration means in Google Analytics, why it impacts SEO and UX, and how DataBrief tracks it with AI-powered insights.",
    h1: "What is Session Duration?",
    definition: "Session duration (also called average session duration) is the average amount of time a visitor spends on your website during a single session. It measures engagement — how long people actually interact with your content.",
    whyItMatters: "Longer session durations typically indicate that visitors find your content valuable and engaging. It's also an indirect SEO signal — search engines may interpret longer sessions as a sign of quality content.",
    howToCalculate: "Average Session Duration = Total Duration of All Sessions ÷ Number of Sessions. In GA4, engagement time is measured more accurately than in Universal Analytics, tracking only active time on the page.",
    goodBenchmark: "Average session duration varies by type: blogs (1-3 minutes), e-commerce (2-5 minutes), SaaS (3-8 minutes), media sites (3-10 minutes). Focus on trends rather than absolute numbers.",
    howDataBriefHelps: "DataBrief monitors session duration trends and breaks them down by source, device, and landing page. When engagement drops, you'll get an AI-powered explanation of what changed and suggestions to fix it.",
    relatedMetrics: ["Bounce Rate", "Pages per Session", "Engagement Rate", "Scroll Depth"],
  },
];

export const comparisonPages: ComparisonPage[] = [
  {
    slug: "vs-google-analytics",
    competitor: "Google Analytics",
    title: "DataBrief vs Google Analytics: Why AI Insights Beat Dashboards",
    metaDescription: "Compare DataBrief vs Google Analytics. DataBrief turns your GA4 data into plain-English AI insights — no dashboards, no learning curve.",
    h1: "DataBrief vs Google Analytics",
    intro: "Google Analytics is the industry standard for web analytics — and DataBrief connects to it. But instead of making you interpret complex dashboards, DataBrief uses AI to tell you what your data actually means.",
    competitorPros: [
      "Free and widely adopted",
      "Extremely detailed raw data access",
      "Deep integration with Google Ads ecosystem",
      "Highly customizable reports and segments",
    ],
    competitorCons: [
      "Steep learning curve — GA4 is notoriously complex",
      "Requires manual analysis to extract insights",
      "No actionable recommendations built in",
      "Non-technical team members can't use it effectively",
    ],
    databriefAdvantages: [
      "Automatic AI-generated briefs in plain English — no analysis needed",
      "Smart alerts flag important changes before you notice them",
      "Actionable recommendations, not just data",
      "Anyone on the team can understand the insights",
      "Connects GA4 with Shopify and Stripe for a unified view",
      "Set up in 2 minutes vs hours of GA4 configuration",
    ],
    bestFor: "DataBrief is best for business owners, marketers, and founders who want to know what their data means without becoming analytics experts. Google Analytics is better if you need raw data access for custom technical analysis.",
  },
  {
    slug: "vs-looker-studio",
    competitor: "Looker Studio",
    title: "DataBrief vs Looker Studio: AI Insights vs Manual Dashboards",
    metaDescription: "Compare DataBrief vs Looker Studio. Skip the manual dashboard building — DataBrief delivers AI-powered insights automatically in plain English.",
    h1: "DataBrief vs Looker Studio",
    intro: "Looker Studio (formerly Google Data Studio) lets you build beautiful custom dashboards. But building and maintaining those dashboards takes time — and they still don't tell you what to do. DataBrief replaces the dashboard entirely with AI-generated insights.",
    competitorPros: [
      "Free to use with Google data sources",
      "Highly customizable visualizations",
      "Great for sharing reports with stakeholders",
      "Connects to many data sources via connectors",
    ],
    competitorCons: [
      "Requires significant setup and design time",
      "Dashboards need ongoing maintenance",
      "No built-in intelligence or recommendations",
      "Still requires humans to interpret the data",
    ],
    databriefAdvantages: [
      "Zero setup required — AI generates insights automatically",
      "No dashboard maintenance — briefs update daily",
      "Plain-English explanations instead of charts to interpret",
      "Proactive alerts instead of passive dashboards",
      "Actionable recommendations built into every insight",
      "Combines data from GA4, Shopify, and Stripe automatically",
    ],
    bestFor: "DataBrief is best for teams who want insights without building dashboards. Looker Studio is better if you need pixel-perfect custom visualizations for executive presentations.",
  },
  {
    slug: "vs-triple-whale",
    competitor: "Triple Whale",
    title: "DataBrief vs Triple Whale: Affordable AI Analytics Alternative",
    metaDescription: "Compare DataBrief vs Triple Whale. Get AI-powered e-commerce analytics without the enterprise price tag. Free during early access.",
    h1: "DataBrief vs Triple Whale",
    intro: "Triple Whale is a popular e-commerce analytics platform with powerful attribution features. DataBrief offers a simpler, AI-first alternative that's free during early access — perfect for brands that want insights without the complexity or cost.",
    competitorPros: [
      "Advanced multi-touch attribution",
      "Deep Shopify and ad platform integrations",
      "Pixel-based tracking for better accuracy",
      "Purpose-built for DTC e-commerce",
    ],
    competitorCons: [
      "Starts at $100+/month — expensive for small brands",
      "Complex setup with pixel installation",
      "Feature-heavy UI can be overwhelming",
      "Overkill for brands under $1M revenue",
    ],
    databriefAdvantages: [
      "Free during early access — no credit card required",
      "AI-generated plain-English briefs instead of complex dashboards",
      "2-minute setup with Windsor.ai — no pixel installation needed",
      "Works for any business, not just DTC e-commerce",
      "Actionable recommendations in every brief",
      "Smart alerts catch issues automatically",
    ],
    bestFor: "DataBrief is best for small-to-mid-size businesses who want AI-powered insights at no cost. Triple Whale is better for larger DTC brands ($1M+) that need advanced multi-touch attribution.",
  },
  {
    slug: "vs-northbeam",
    competitor: "Northbeam",
    title: "DataBrief vs Northbeam: Simple AI Analytics Alternative",
    metaDescription: "Compare DataBrief vs Northbeam. Get AI-powered marketing insights without the enterprise complexity. Free during early access.",
    h1: "DataBrief vs Northbeam",
    intro: "Northbeam offers sophisticated marketing attribution for high-spend brands. DataBrief takes a different approach — instead of complex attribution models, it uses AI to explain what's happening in your data in plain English.",
    competitorPros: [
      "Advanced MMM and MTA attribution models",
      "Real-time marketing mix optimization",
      "Server-side tracking for better accuracy",
      "Built for high-spend media buying teams",
    ],
    competitorCons: [
      "Very expensive — starts at $1,000+/month",
      "Requires significant ad spend to be useful",
      "Complex setup and onboarding process",
      "Designed for data-savvy teams only",
    ],
    databriefAdvantages: [
      "Free during early access — accessible to any size business",
      "Plain-English AI insights anyone can understand",
      "Set up in 2 minutes, not days",
      "Works with any ad spend level",
      "Combines GA4, Shopify, and Stripe data automatically",
      "Daily AI briefs replace manual analysis",
    ],
    bestFor: "DataBrief is best for businesses that want clear, actionable insights without enterprise costs. Northbeam is better for brands spending $100K+/month on ads who need granular attribution modeling.",
  },
];

export const allSeoSlugs = [
  ...useCasePages.map((p) => `/for/${p.slug}`),
  ...metricPages.map((p) => `/learn/${p.slug}`),
  ...comparisonPages.map((p) => `/compare/${p.slug}`),
];
