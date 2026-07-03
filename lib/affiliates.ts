/**
 * Affiliate link configuration
 * Add your affiliate URL for each tool name (must match exactly as in lib/tools.ts)
 * Leave blank or omit to fall back to the tool's direct URL
 */
export const AFFILIATE_LINKS: Record<string, string> = {
  // Writing
  "Jasper": "",           // jasper.partnerstack.com — paste your link here
  "Copy.ai": "",          // app.copy.ai/affiliate — paste your link here
  "Writesonic": "",       // writesonic.com/affiliate — paste your link here
  "Anyword": "",
  "Rytr": "",

  // Marketing / SEO
  "Surfer SEO": "",       // surferseo.com/affiliate — paste your link here
  "Semrush": "",          // beraffiliate.semrush.com — paste your link here
  "AdCreative.ai": "",    // adcreative.ai/affiliate — paste your link here
  "Clearscope": "",

  // Images
  "Midjourney": "",
  "Leonardo.ai": "",

  // Coding
  "GitHub Copilot": "",
  "Cursor": "",
  "Tabnine": "",

  // Video
  "Runway": "",
  "HeyGen": "",
  "Synthesia": "",
  "Descript": "",

  // Productivity
  "Notion AI": "",
  "Motion": "",
  "Taskade": "",
  "Zapier AI": "",

  // Audio / Voice
  "ElevenLabs": "https://try.elevenlabs.io/2rawfimlk42w",  // LIVE — PartnerStack, approved Jul 2026
};

/**
 * Returns the best URL for a tool:
 * - affiliate link if configured
 * - direct URL as fallback
 * Appends UTM params for click tracking
 */
export function getToolUrl(toolName: string, directUrl: string): string {
  const affiliate = AFFILIATE_LINKS[toolName];
  const base = affiliate && affiliate.trim() !== "" ? affiliate : directUrl;

  // Add UTM tracking
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}utm_source=howtousemyai&utm_medium=directory&utm_campaign=tool_card`;
}
