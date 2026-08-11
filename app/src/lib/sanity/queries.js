import { mediaAssetFragment } from "./fragments";

export const siteQuery = `*[_type=="site"][0]{
  title,
  favicon{
    asset->{
      url
    }
  },
  description,
  address,
  email,
  phone,
  socials[]{
    platform,
    link
  },
}`;

const projectFields = `{
  _id,
  _type,
  title,
  categories[]->{
    _id,
    name,
  },
  description,
  credits[]{
    role,
    entries
  },
  thumbnail[0] ${mediaAssetFragment},
  gallery[] ${mediaAssetFragment},
  link,
  slug
}`;

export const projectsQuery = `*[_type=="project"] | order(title asc) ${projectFields}`;

export const projectQuery = `*[_type=="project" && slug.current == $slug][0] ${projectFields}`;

export const projectSlugsQuery = `*[_type=="project" && defined(slug.current)][]{
  "slug": slug.current
}`;
