import type { Suggestion } from "@/content/sample";
import { SourceChip } from "./SourceChip";

/** Sources and confidence under an AI line. Every AI line has at least one source. */
export function Meta({ item }: { item: Suggestion }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-2">
      {item.sources.map((id) => (
        <SourceChip key={id} id={id} />
      ))}
      <span>
        Confidence: {item.confidence.toLowerCase()}
        {item.confidence === "Medium" ? " · check this" : ""}
      </span>
    </div>
  );
}
