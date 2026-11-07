/** A number that rolls up from zero when it appears. The real value is always in the text for screen readers. */
export function Num({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <>
      <span className="num-roll" style={{ "--to": value } as React.CSSProperties} aria-hidden="true" />
      {suffix ? <span aria-hidden="true">{suffix}</span> : null}
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </>
  );
}
