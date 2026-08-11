import { mediaAssetFragment, imageAssetFragment } from "./fragments";

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

export const aboutPageQuery = `*[_type=="aboutPage"][0]{
  lead,
  credits[]{
    role,
    entries
  },
  portrait[0] ${mediaAssetFragment},
}`;

export const contactPageQuery = `*[_type=="contactPage"][0]{
  lead,
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

export const pressQuery = `*[_type=="press"] | order(title asc) {
  _id,
  _type,
  cover ${imageAssetFragment}
}`;

export const projectsQuery = `*[_type=="project"] | order(title asc) ${projectFields}`;

export const projectQuery = `*[_type=="project" && slug.current == $slug][0] ${projectFields}`;

export const projectSlugsQuery = `*[_type=="project" && defined(slug.current)][]{
  "slug": slug.current
}`;
