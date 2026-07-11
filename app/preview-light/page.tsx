import fs from "fs";
import path from "path";
import V2Page from "../v2/page";

// TEMPORARY preview route — NOT linked from nav/sitemap, localhost only.
// White/blue/green/red light-theme direction: hand-written override (not a
// mechanical recolor like /preview-teal) since going light means replacing
// the dark-space decoration system, not just swapping one accent hue.
// Delete this whole route once the color decision is made.
export default function PreviewLightPage() {
  const overrideCss = fs.readFileSync(
    path.join(process.cwd(), "app/preview-light/overrides.css"),
    "utf8"
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: overrideCss }} />
      <V2Page />
    </>
  );
}
