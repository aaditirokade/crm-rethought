import type { NextConfig } from "next";

/**
 * Groundwork lives at aaditirokade.com/groundwork: the portfolio site forwards
 * that path here (decision 0038), so every page and asset is served under it.
 */
const BASE_PATH = "/groundwork";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  // Next adds the base path to <Link>, the router and its own assets; plain src and href strings read this.
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  async redirects() {
    // Links to the old address (/, /prototype, /mobile...) land on the same page under the base path.
    return [
      { source: "/", destination: BASE_PATH, basePath: false, permanent: false },
      { source: "/:path((?!groundwork(?:/|$)).+)", destination: `${BASE_PATH}/:path`, basePath: false, permanent: false },
    ];
  },
};

export default nextConfig;
