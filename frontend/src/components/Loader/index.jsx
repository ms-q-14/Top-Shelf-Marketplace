import { React, useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function Loader(props) {
  useEffect(() => {
    const animData = {
      wrapper: container.current,
      animType: "svg",
      loop: true,
      prerender: true,
      autoplay: true,
      path: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/35984/LEGO_loader.json",
    };
    const anim = lottie.loadAnimation(animData);
    anim.setSpeed(3.4);

    return () => {
      anim.destroy();
    };
  }, []);
  const container = useRef(null);

  return (
    <div className={`loader__container ${props.className}`} ref={container} />
  );
}
