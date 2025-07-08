import { PathSerializationStyle } from "../types/common";

export function pathBuilder(options: {
  style: PathSerializationStyle;
  explode: boolean;
}) {
  function getPath(
    path: string,
    params: Record<
      string,
      string | number | string[] | number[] | Record<string, string | number>
    > | null,
  ) {
    const { explode } = options;
    if (!params) {
      return path;
    }

    const resolvedPath = path.replace(/\{([^}]+)\}/g, (_, pathKey) => {
      const value = params[pathKey];
      if (explode) {
        if (!Array.isArray(value) && typeof value === "object") {
          return getObjectExploded(value);
        }
      }

      if (Array.isArray(value)) {
        return getArray(value);
      } else if (typeof value === "object") {
        return getObject(value);
      }

      return encodeURIComponent(params[pathKey] as string);
    });

    return resolvedPath;
  }

  return { getPath };
}

function getArray(value: (string | number)[]) {
  return value.join(",");
}

function getObjectExploded(value: Record<string, string | number>) {
  return Object.entries(value)
    .map(([subKey, subValue]) => `${subKey}=${subValue}`)
    .join(",");
}

function getObject(value: Record<string, string | number>) {
  return Object.entries(value)
    .map(([subKey, subValue]) => `${subKey},${subValue}`)
    .join(",");
}
