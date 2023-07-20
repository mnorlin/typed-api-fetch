/**
 * Creates a union of integers in the range between <pre>Start</pre> and <pre>End</pre>.
 */
export type IntRange<Start extends number, End extends number> = Exclude<
  Enumerate<End>,
  Enumerate<Start>
>;

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;
