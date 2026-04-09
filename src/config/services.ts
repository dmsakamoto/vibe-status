export type FetcherType = "statuspage" | "statusio" | "google-incidents";

export interface ServiceConfig {
  key: string;
  name: string;
  statusPageUrl: string;
  category: string;
  fetcherType?: FetcherType;
  fetcherConfig?: Record<string, string>;
}

export const SERVICE_CATALOG: ServiceConfig[] = [
  // AI
  { key: "claude", name: "Claude", statusPageUrl: "https://status.claude.com", category: "AI" },
  { key: "openai", name: "OpenAI", statusPageUrl: "https://status.openai.com", category: "AI" },
  { key: "codex", name: "Codex", statusPageUrl: "https://status.openai.com", category: "AI" },
  { key: "elevenlabs", name: "ElevenLabs", statusPageUrl: "https://status.elevenlabs.io", category: "AI" },
  { key: "gemini", name: "Gemini", statusPageUrl: "https://status.cloud.google.com", category: "AI", fetcherType: "google-incidents", fetcherConfig: { incidentsUrl: "https://status.cloud.google.com/incidents.json", productName: "Vertex Gemini API" } },

  // Dev Tools
  { key: "github", name: "GitHub", statusPageUrl: "https://www.githubstatus.com", category: "Dev Tools" },
  { key: "gitlab", name: "GitLab", statusPageUrl: "https://status.gitlab.com", category: "Dev Tools" },
  { key: "bitbucket", name: "Bitbucket", statusPageUrl: "https://bitbucket.status.atlassian.com", category: "Dev Tools" },
  { key: "npm", name: "npm", statusPageUrl: "https://status.npmjs.org", category: "Dev Tools" },
  { key: "linear", name: "Linear", statusPageUrl: "https://linearstatus.com", category: "Dev Tools" },
  { key: "jira", name: "Jira", statusPageUrl: "https://jira-software.status.atlassian.com", category: "Dev Tools" },
  { key: "launchdarkly", name: "LaunchDarkly", statusPageUrl: "https://status.launchdarkly.com", category: "Dev Tools" },

  // Database
  { key: "supabase", name: "Supabase", statusPageUrl: "https://status.supabase.com", category: "Database" },
  { key: "neon", name: "Neon", statusPageUrl: "https://neonstatus.com", category: "Database", fetcherType: "statusio", fetcherConfig: { pageId: "6878fc85709daa75be6c7e3c" } },

  // Cloud
  { key: "vercel", name: "Vercel", statusPageUrl: "https://www.vercel-status.com", category: "Cloud" },
  { key: "netlify", name: "Netlify", statusPageUrl: "https://www.netlifystatus.com", category: "Cloud" },
  { key: "heroku", name: "Heroku", statusPageUrl: "https://status.heroku.com", category: "Cloud" },
  { key: "render", name: "Render", statusPageUrl: "https://status.render.com", category: "Cloud" },
  { key: "digitalocean", name: "DigitalOcean", statusPageUrl: "https://status.digitalocean.com", category: "Cloud" },
  { key: "cloudflare", name: "Cloudflare", statusPageUrl: "https://www.cloudflarestatus.com", category: "Cloud" },
  { key: "flyio", name: "Fly.io", statusPageUrl: "https://status.flyio.net", category: "Cloud" },

  // Analytics
  { key: "posthog", name: "PostHog", statusPageUrl: "https://www.posthogstatus.com", category: "Analytics" },
  { key: "hotjar", name: "Hotjar", statusPageUrl: "https://status.hotjar.com", category: "Analytics" },

  // Design
  { key: "figma", name: "Figma", statusPageUrl: "https://status.figma.com", category: "Design" },

  // Comms
  { key: "discord", name: "Discord", statusPageUrl: "https://discordstatus.com", category: "Comms" },
  { key: "zoom", name: "Zoom", statusPageUrl: "https://status.zoom.us", category: "Comms" },

  // Storage
  { key: "dropbox", name: "Dropbox", statusPageUrl: "https://status.dropbox.com", category: "Storage" },

  // Email
  { key: "resend", name: "Resend", statusPageUrl: "https://resend-status.com", category: "Email" },

  // Google
  { key: "firebase", name: "Firebase", statusPageUrl: "https://status.firebase.google.com", category: "Cloud", fetcherType: "google-incidents", fetcherConfig: { incidentsUrl: "https://status.firebase.google.com/incidents.json" } },
  { key: "google-drive", name: "Google Drive", statusPageUrl: "https://www.google.com/appsstatus/dashboard", category: "Storage", fetcherType: "google-incidents", fetcherConfig: { incidentsUrl: "https://www.google.com/appsstatus/dashboard/incidents.json", productName: "Google Drive" } },
  { key: "google-analytics", name: "Google Analytics", statusPageUrl: "https://www.google.com/appsstatus/dashboard", category: "Analytics", fetcherType: "google-incidents", fetcherConfig: { incidentsUrl: "https://www.google.com/appsstatus/dashboard/incidents.json", productName: "Google Analytics" } },

  // Infra
  { key: "pagerduty", name: "PagerDuty", statusPageUrl: "https://status.pagerduty.com", category: "Infra" },
  { key: "datadog", name: "Datadog", statusPageUrl: "https://status.datadoghq.com", category: "Infra" },
  { key: "sentry", name: "Sentry", statusPageUrl: "https://status.sentry.io", category: "Infra" },
  { key: "twilio", name: "Twilio", statusPageUrl: "https://status.twilio.com", category: "Infra" },
  { key: "stripe", name: "Stripe", statusPageUrl: "https://status.stripe.com", category: "Infra" },
];

export const DEFAULT_SERVICE_KEYS = [
  "claude",
  "openai",
  "github",
  "vercel",
  "netlify",
  "npm",
  "linear",
  "figma",
  "flyio",
];

const catalogMap = new Map(SERVICE_CATALOG.map((s) => [s.key, s]));

export function getServicesByKeys(keys: string[]): ServiceConfig[] {
  return keys
    .map((key) => catalogMap.get(key))
    .filter((s): s is ServiceConfig => s !== undefined);
}

export function isValidServiceKey(key: string): boolean {
  return catalogMap.has(key);
}
