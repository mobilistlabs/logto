import path from 'node:path';

export const normalizePath = (pathLike: string) => {
  const value = path.normalize(pathLike);

  return value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value;
};

export const matchPathname = (
  toMatch: string,
  pathname: string,
  ignorePathnames: string[] = []
) => {
  const toMatchPathname = normalizePath(toMatch);
  const normalized = normalizePath(pathname);

  if (ignorePathnames.some((prefix) => matchPathname(prefix, pathname))) {
    return false;
  }

  if (normalized === toMatchPathname) {
    return '/';
  }

  if (toMatchPathname === '/') {
    return normalized;
  }

  if (normalized.startsWith(toMatchPathname + '/')) {
    return normalized.slice(toMatchPathname.length);
  }

  return false;
};
