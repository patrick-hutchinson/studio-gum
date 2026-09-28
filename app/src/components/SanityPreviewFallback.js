const FALLBACK_MESSAGE = "⚠️ This field is not filled in Sanity.";

const getFallbackMessage = (fieldTitle) => (fieldTitle ? `⚠️ (\`${fieldTitle}\`) is missing in Sanity.` : FALLBACK_MESSAGE);

export const isSanityPreviewEnvironment = process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";

export const hasSanityValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
};

export const hasMissingSanityData = (...values) => values.some((value) => !hasSanityValue(value));

export const shouldShowSanityPreviewFallback = (...values) => isSanityPreviewEnvironment && hasMissingSanityData(...values);

export default function SanityPreviewFallback({ as: Element = "div", className = "", fieldTitle, children }) {
  if (!isSanityPreviewEnvironment) return null;

  return (
    <Element
      className={className}
      style={{
        display: "inline",
        fontSize: "1rem",
        lineHeight: 1,
        opacity: 0.65,
        color: "#E6037B",
        fontWeight: "bold",
      }}
    >
      {children || getFallbackMessage(fieldTitle)}
    </Element>
  );
}

export function SanityPreviewValue({ value, children, as = "span", className = "", fieldTitle }) {
  if (hasSanityValue(value)) return children || value;

  return <SanityPreviewFallback as={as} className={className} fieldTitle={fieldTitle} />;
}
