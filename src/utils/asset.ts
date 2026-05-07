// Resolves a public/-folder path against Vite's configured base, so it works
// both in dev (base = "/") and on GitHub Pages (base = "/DaveysBagels/").
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
