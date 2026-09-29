import NextImage from "next/image";

const Image = ({ medium, setIsLoaded, eager = false, objectFit, objectPosition, onLoad }) => {
  const imageSource = medium.url;

  const resolutionWidth = medium.width;
  const resolutionHeight = medium.height;

  const imageStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    objectFit: objectFit ?? "contain",
    objectPosition: objectPosition ?? "center",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        aspectRatio: resolutionWidth / resolutionHeight,
        position: "relative",
      }}
    >
      <NextImage
        src={imageSource}
        alt="image"
        unoptimized
        width={resolutionWidth}
        height={resolutionHeight}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="sync"
        draggable={false}
        style={imageStyle}
        onLoad={() => {
          setIsLoaded?.(true);
          onLoad?.();
        }}
      />
    </div>
  );
};

export default Image;
