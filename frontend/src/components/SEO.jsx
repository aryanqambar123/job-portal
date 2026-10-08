import { Helmet } from "react-helmet-async";

// Deploy ke baad apna asli link .env.production mein VITE_SITE_URL ke naam se lagayein
const SITE_URL = import.meta.env.VITE_SITE_URL || "";

export default function SEO({
  title = "JobPortal - Find Jobs, Internships & Fellowships Online",
  description = "JobPortal par latest jobs, internships, fellowships aur graduate programs dhoondein aur online apply karein.",
  path = "",
  type = "website",
  noindex = false,
  schema = null,
}) {
  const url = SITE_URL + path;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      {SITE_URL && <link rel="canonical" href={url} />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {SITE_URL && <meta property="og:url" content={url} />}

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}