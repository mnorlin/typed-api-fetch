export type Same<A, B> = A extends B ? (B extends A ? true : false) : false;
export type IsEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends <
  G
>() => G extends U ? 1 : 2
  ? true
  : false;
export type IsNever<A> = [A] extends [never] ? true : false;
