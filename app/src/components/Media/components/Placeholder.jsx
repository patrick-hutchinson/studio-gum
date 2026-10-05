import NextImage from "next/image";

const Placeholder = ({ medium, isLoaded, objectFit, objectPosition }) => {
  let src;

  medium.type === "image"
    ? (src = `${medium.url}?w=20&fit=crop&auto=format`)
    : (src = `https://image.mux.com/${medium.playbackId}/thumbnail.jpg?width=50`);

  return (
    <NextImage
      src={src}
      fill
      loading="eager"
      alt="placeholder image"
      style={{
        position: "absolute",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        filter: "blur(20px) brightness(1.3)",
        transform: objectFit === "contain" ? "scale(2)" : "scale(1.5)",
        opacity: isLoaded ? 0 : 1,
        transition: "opacity 0.5s ease 0.5s",
        zIndex: 3,
        objectFit: objectFit ?? "contain",
        objectPosition: objectPosition ?? "center",
      }}
    />
  );
};

export default Placeholder;
