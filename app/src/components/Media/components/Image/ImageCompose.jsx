import { useState } from "react";

import Image from "./Image";
import styles from "../../Media.module.css";
import Placeholder from "../Placeholder";

const ImageCompose = ({ medium, className, eager = false, objectFit }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`${styles.mediaContainer} ${className}`}>
      <Placeholder medium={medium} isLoaded={isLoaded} objectFit={objectFit} />
      <Image medium={medium} setIsLoaded={setIsLoaded} eager={eager} objectFit={objectFit} />
    </div>
  );
};

export default ImageCompose;
