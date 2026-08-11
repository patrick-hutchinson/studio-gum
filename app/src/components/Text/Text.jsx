import { PortableText } from "@portabletext/react";

import Link from "next/link";

function getLinkHref(link) {
  if (link?.type === "email" && link.email) return `mailto:${link.email}`;
  if (link?.type === "external" && link.url) return link.url;

  return null;
}

const Text = ({ text, typo, className, components, style }) => {
  if (!Array.isArray(text)) {
    return text ? (
      <p typo={typo} className={className} style={{ ...style }}>
        {text}
      </p>
    ) : null;
  }

  return (
    <div className={className} typo={typo} style={{ ...style }}>
      <PortableText
        value={text}
        components={{
          ...components,
          marks: {
            link: ({ value, children }) => {
              if (!value) return children;

              const href = getLinkHref(value);

              if (!href) return children;

              return <Link href={href}>{children}</Link>;
            },
            ...components?.marks,
          },
        }}
      />
    </div>
  );
};

export default Text;
