import { getPreviewClient, getProductionClient } from "./client";
import {
  projectQuery,
  projectSlugsQuery,
  projectsQuery,
  siteQuery,
  aboutPageQuery,
  pressQuery,
  videoPageQuery,
  categoriesQuery,
} from "./queries";

export function getSanityClient() {
  const isProduction = process.env.VERCEL_ENV === "production";
  const isPreview = process.env.VERCEL_ENV === "preview";
  const isLocal = !process.env.VERCEL_ENV;
  const hasReadToken = Boolean(process.env.SANITY_READ_TOKEN);

  if ((isPreview || isLocal) && hasReadToken) {
    return getPreviewClient();
  }

  if (isProduction || !hasReadToken) {
    return getProductionClient();
  }

  return getProductionClient();
}

function normalizeSite(site) {
  if (!site) return {};

  return {
    ...site,
    faviconUrl: site.favicon?.asset?.url || null,
  };
}

export async function getSite() {
  const site = await getSanityClient().fetch(siteQuery);

  return normalizeSite(site);
}

export async function getAboutPage() {
  const aboutPage = await getSanityClient().fetch(aboutPageQuery);

  return aboutPage || [];
}

export async function getProjects() {
  const projects = await getSanityClient().fetch(projectsQuery);

  return projects || [];
}

export async function getCategories() {
  const categories = await getSanityClient().fetch(categoriesQuery);

  return categories || [];
}

export async function getPress() {
  const press = await getSanityClient().fetch(pressQuery);

  return press || [];
}

export async function getVideoPage() {
  const press = await getSanityClient().fetch(videoPageQuery);

  return press || [];
}

export async function getProject(slug) {
  if (!slug) return null;

  const project = await getSanityClient().fetch(projectQuery, { slug });

  return project || null;
}

export async function getProjectSlugs() {
  const projects = await getSanityClient().fetch(projectSlugsQuery);

  return projects || [];
}
