import { BASE } from "@/lib/base";

const REPO = "https://github.com/aaditirokade/crm-rethought";

/**
 * Chapter 04 (decision 0137): the data visualization work on its own. First the longest walk a chart offers, from a
 * question to a saved move; then the rules every chart follows; then the record of how the palette was chosen.
 * Each picture is a light and dark pair, so the chapter follows the page's theme like the recordings do.
 */
function Shot({ name, w, h, alt, className = "" }: { name: string; w: number; h: number; alt: string; className?: string }) {
  return (
    <span className={`dv-shot ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${BASE}/case/viz/${name}-light.jpg`} width={w} height={h} alt={alt} className="only-light" loading="lazy" decoding="async" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${BASE}/case/viz/${name}-dark.jpg`} width={w} height={h} alt={alt} className="only-dark" loading="lazy" decoding="async" />
    </span>
  );
}

const RULES: [string, string][] = [
  [
    "Color never works alone",
    "Health is three solid colors and three words; confidence is bars that count as well as color. The three are checked for colorblind separation, so a row of accounts still sorts itself with the color gone.",
  ],
  [
    "Periwinkle is data, rose is action",
    "Marks and trends are periwinkle; the one warm color on the page is the rose of the actions. A chart can sit beside a button without competing for the eye.",
  ],
  [
    "The exact number is one hover away",
    "The surface shows the shape; a cursor line with its day label and a tooltip carry the numbers. The same data sits in a table below the chart, for screen readers and for anyone who wants rows.",
  ],
  [
    "Readable in both themes",
    "Text on every chart passes WCAG AA in light and dark, and the marks hold at least 3:1 against their cards.",
  ],
];

const ROUNDS: { img: string; w: number; h: number; text: string }[] = [
  { img: "round-dark", w: 1400, h: 601, text: "Dark and glossy first: glass cubes, faceted tetrahedra, prisms. Striking, and too heavy for a tool used all day." },
  { img: "round-light", w: 1400, h: 1198, text: "So the palette went light and the art carried the weight: six directions, from pearl cubes to ink marble." },
  { img: "round-grass", w: 1400, h: 969, text: "The shards read as blades, so they grew into glass leaves: broad ones against long arching ones. Broad won." },
  { img: "round-palettes", w: 1400, h: 1172, text: "The leaves in all six pastel palettes, compared on the same screen." },
  { img: "round-blend", w: 1400, h: 969, text: "The last two blended: periwinkle warming to rose quartz, led from either end." },
  { img: "round-blend-dark", w: 1400, h: 1731, text: "Both blends at night. Rose leads won: on a periwinkle page, the rose actions are the one warm thing." },
];

export function DataViz() {
  return (
    <section aria-labelledby="ch-04" className="border-t border-[var(--rule)] py-16 lg:py-24">
      <div className="max-w-[62ch]">
        <p className="font-mono text-meta tracking-wide text-accent">04 · DATA VISUALIZATION</p>
        <h2 id="ch-04" className="mt-3 text-[1.75rem] font-medium leading-tight tracking-tight sm:text-[2rem]">
          Every chart is built backward from a decision
        </h2>
        <p className="mt-5 text-[17px] leading-relaxed text-ink-2">
          A dashboard that only reports gets closed. Each chart here starts from a decision an account manager has to
          make, and ends where the decision is made. The portfolio map is the longest walk.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <figure className="min-w-0 lg:col-span-8">
          <Shot name="dd1" w={1760} h={940} alt="The portfolio map: accounts plotted by days until renewal against the eight week usage trend, bubble size showing stores. A shaded corner is labeled renewing soon and falling. The cursor rests on Fernhill Outfitters, with a dotted day line at 74 days and a tooltip giving health, renewal, usage and stores." className="dv-frame" />
          <figcaption className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-ink-2">
            <span className="font-mono text-meta tracking-wide text-ink">01 · THE QUESTION ON THE WALL</span>
            <span className="mt-1 block">
              Days until renewal against the usage trend; the shaded corner is the one that costs money. The hover brings
              the exact numbers: Fernhill renews in 74 days with usage down 36%.
            </span>
          </figcaption>
        </figure>
        <figure className="min-w-0 lg:col-span-4">
          <Shot name="dd2" w={1036} h={1640} alt="The account panel opened from the map: Fernhill Outfitters with its health tag, renewal, usage, last touch and store count on a night periwinkle block, then the next step, ten lines waiting for approval with a Review link, people, the renewal opportunity, and the latest interactions." className="dv-frame" />
          <figcaption className="mt-3 text-[15px] leading-relaxed text-ink-2">
            <span className="font-mono text-meta tracking-wide text-ink">02 · THE ACCOUNT BEHIND THE BUBBLE</span>
            <span className="mt-1 block">Selecting the bubble opens the account in place: the numbers, the people, and what waits for approval.</span>
          </figcaption>
        </figure>
        <figure className="min-w-0 lg:col-span-12">
          <Shot name="dd3" w={2600} h={840} alt="Review: the Fernhill Outfitters quarterly review group with nine drafted cards, each carrying its source and confidence, with approve, edit and dismiss controls." className="dv-frame" />
          <figcaption className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-ink-2">
            <span className="font-mono text-meta tracking-wide text-ink">03 · IT ENDS IN A MOVE</span>
            <span className="mt-1 block">
              Review holds the drafted lines the chart led to, each with its source and confidence. Approving saves to the
              record; nothing moves without a person.
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="mt-14">
        <h3 className="text-h3 font-semibold">The rules the charts follow</h3>
        <ul className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {RULES.map(([t, d]) => (
            <li key={t} className="border-t border-[var(--rule)] pt-4">
              <p className="font-medium">{t}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{d}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14">
        <h3 className="text-h3 font-semibold">How the palette was chosen</h3>
        <p className="mt-2 max-w-[62ch] text-[17px] leading-relaxed text-ink-2">
          The colors came out of a recorded exploration, not a mood board: twelve rounds, each a set of options compared
          on the same screens.
        </p>
        <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {ROUNDS.map((r, i) => (
            <li key={r.img}>
              <span className="dv-shot dv-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BASE}/case/viz/${r.img}.jpg`} width={r.w} height={r.h} alt="" loading="lazy" decoding="async" />
              </span>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">
                <span className="font-mono text-meta tracking-wide text-ink">{String(i + 1).padStart(2, "0")}</span> · {r.text}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[62ch] text-[17px] leading-relaxed text-ink-2">
          Then the numbers: white on the rose button 5.1:1 in light and 4.5:1 in dark, rose draft text 6.1:1 on cards and
          8.5:1 at night, periwinkle chart marks 3.7:1 and 5.8:1 against their cards. The whole exploration, image by
          image, is{" "}
          <a href={`${REPO}/tree/main/research/color-exploration`} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline underline-offset-4">
            in the repo
          </a>
          .
        </p>
      </div>
    </section>
  );
}
