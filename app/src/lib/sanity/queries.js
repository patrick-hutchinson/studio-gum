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
  googleMaps,
  email,
  phone,
  socials[]{
    platform,
    handle,
    link
  },
}`;

export const aboutPageQuery = `*[_type=="aboutPage"][0]{
  lead,
  currentTeam,
  pastTeam,
  portrait[0] ${mediaAssetFragment},
}`;

export const videoPageQuery = `*[_type=="videoPage"][0]{
  videos[] ${mediaAssetFragment}
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
  gallery{
    credit,
    media[] ${mediaAssetFragment},
  },
  link,
  slug
}`;

export const pressQuery = `*[_type=="press"] | order(orderRank asc, title asc) {
  _id,
  _type,
  cover ${imageAssetFragment}
}`;

export const projectsQuery = `*[_type=="project"] | order(orderRank asc, title asc) ${projectFields}`;

export const projectQuery = `*[_type=="project" && slug.current == $slug][0] ${projectFields}`;

export const categoriesQuery = `*[_type=="category"] | order(name asc) {
  _id,
  name
}`;

export const projectSlugsQuery = `*[_type=="project" && defined(slug.current)][]{
  "slug": slug.current
}`;
