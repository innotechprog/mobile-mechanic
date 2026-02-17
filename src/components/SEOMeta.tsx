import { useEffect } from "react";

interface SEOMetaProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
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

const SEOMeta = ({ title, description, canonical, ogImage, ogType = "website" }: SEOMetaProps) => {
  const fullTitle = title === BASE_TITLE ? `${BASE_TITLE} — We Come To You` : `${title} | ${BASE_TITLE}`;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : `${baseUrl}/`;
  const imageUrl = ogImage?.startsWith("http") ? ogImage : ogImage ? `${baseUrl}${ogImage}` : undefined;

  useEffect(() => {
    document.title = fullTitle;
    ensureMeta("name", "description", description);
    ensureMeta("property", "og:title", fullTitle);
    ensureMeta("property", "og:description", description);
    ensureMeta("property", "og:url", canonicalUrl);
    ensureMeta("property", "og:type", ogType);
    if (imageUrl) ensureMeta("property", "og:image", imageUrl);

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
  }, [fullTitle, description, canonicalUrl, imageUrl, ogType]);

  return null;
};

export default SEOMeta;
