import fs from "fs";
import path from "path";
import V2Page from "../v2/page";

// TEMPORARY preview route — NOT linked from nav/sitemap, localhost only.
// Renders the real homepage unchanged, then layers a full recolor of every
// hardcoded blue value (var()-based AND the ~170 hardcoded rgba()/#hex
// instances found in globals.css) to a teal signature color, so the
// "Signature Swap" direction can be seen live instead of as static swatches.
// teal-overrides.generated.css is a mechanically-generated copy of
// globals.css with only blue values substituted — same selectors, same
// specificity, loaded after the real stylesheet so it wins by source order.
// Delete this whole route + generated file once the color decision is made.
export default function PreviewTealPage() {
  const overrideCss = fs.readFileSync(
    path.join(process.cwd(), "app/preview-teal/teal-overrides.generated.css"),
    "utf8"
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: overrideCss }} />
      <V2Page />
    </>
  );
}
