import TurndownService from "turndown";

export function extractMarkdownFromClipboard(
  event: React.ClipboardEvent<HTMLTextAreaElement>
): string | null {
  const html = event.clipboardData.getData("text/html");
  if (!html) return null;

  const td = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });
  td.remove(["style", "script"]);

  return td.turndown(html);
}
