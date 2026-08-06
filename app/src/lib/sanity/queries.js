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

export const projectQuery = `*[_type=="project" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  categories[]->{
    _id,
    name,
  },
  description
  credits[]{
    role,
    entries
  },
  thumbnail[0] ${mediaAssetFragment},
  gallery[]{
    _key,
    media[] ${mediaAssetFragment}
  },
  link,
  slug
}`;
