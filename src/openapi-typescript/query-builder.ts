import { QuerySerializationStyle } from "../types/common";

export function queryBuilder(options: {
  style: QuerySerializationStyle;
  explode: boolean;
}) {
  const { style, explode } = options;

  function getQuery(
    params: Record<
      string,
      string | number | string[] | number[] | Record<string, string | number>
    > | null
  ): string {
    if (!params) {
      return "";
    }

    const searchParams = Object.entries(params).map(([key, value]) => {
      if (explode) {
        if (Array.isArray(value)) {
          return getArrayExploded(key, value);
        } else if (typeof value === "object") {
          return getObjectExploded(key, value);
        }
      }

      if (Array.isArray(value)) {
        return getArray(key, value, style);
      } else if (typeof value === "object") {
        return getObject(key, value);
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(
        `${params[key]}`
      )}`;
    });

    return "?" + searchParams.join("&");
  }

  return { getQuery };
}

function getArray(
  key: string,
  value: (string | number)[],
  style: QuerySerializationStyle
) {
  const QuerySeparator = {
    form: ",",
    spaceDelimited: "%20",
    pipeDelimited: "|",
  } satisfies Record<QuerySerializationStyle, string>;

  return `${encodeURIComponent(key)}=${value
    .map((v) => encodeURIComponent(`${v}`))
    .join(QuerySeparator[style])}`;
}

function getArrayExploded(key: string, value: (string | number)[]) {
  return value
    .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(`${v}`)}`)
    .join("&");
}

function getObject(key: string, value: Record<string, string | number>) {
  return `${encodeURIComponent(key)}=${Object.entries(value)
    .map(([subKey, subVal]) => `${subKey},${subVal}`)
    .join(",")}`;
}

function getObjectExploded(_: string, value: Record<string, string | number>) {
  return Object.entries(value)
    .map(
      ([subKey, subVal]) =>
        `${encodeURIComponent(subKey)}=${encodeURIComponent(`${subVal}`)}`
    )
    .join("&");
}
