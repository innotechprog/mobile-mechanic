import { useEffect } from "react";

interface SEOMetaProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
}

const BASE_TITLE = "Metro Mobile Mechanic";

const ensureMeta = (attr: "name" | "property", key: string, content: string) => {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const DEFAULT_IMAGE = "/logo.png";
const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

const SEOMeta = ({
  title,
  description,
  canonical,
  ogImage,
  ogImageAlt,
  ogImageWidth = DEFAULT_IMAGE_WIDTH,
  ogImageHeight = DEFAULT_IMAGE_HEIGHT,
  ogType = "website",
  twitterCard = "summary_large_image",
}: SEOMetaProps) => {
  const fullTitle = title === BASE_TITLE ? `${BASE_TITLE} — We Come To You` : `${title} | ${BASE_TITLE}`;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : `${baseUrl}/`;
  const imageUrl = ogImage?.startsWith("http") ? ogImage : ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}${DEFAULT_IMAGE}`;
  const imageAlt = ogImageAlt ?? "Metro Mobile Mechanic - Professional mobile auto repair";

  useEffect(() => {
    document.title = fullTitle;
    ensureMeta("name", "description", description);
    ensureMeta("property", "og:title", fullTitle);
    ensureMeta("property", "og:description", description);
    ensureMeta("property", "og:url", canonicalUrl);
    ensureMeta("property", "og:type", ogType);
    ensureMeta("property", "og:site_name", "Metro Mobile Mechanic");
    ensureMeta("property", "og:locale", "en_AU");
    ensureMeta("property", "og:image", imageUrl);
    ensureMeta("property", "og:image:width", String(ogImageWidth));
    ensureMeta("property", "og:image:height", String(ogImageHeight));
    ensureMeta("property", "og:image:alt", imageAlt);
    ensureMeta("name", "twitter:card", twitterCard);
    ensureMeta("name", "twitter:title", fullTitle);
    ensureMeta("name", "twitter:description", description);
    ensureMeta("name", "twitter:image", imageUrl);
    ensureMeta("name", "twitter:image:alt", imageAlt);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    return () => {
      document.title = `${BASE_TITLE} — We Come To You`;
    };
  }, [fullTitle, description, canonicalUrl, imageUrl, imageAlt, ogType, ogImageWidth, ogImageHeight, twitterCard]);

  return null;
};

export default SEOMeta;
