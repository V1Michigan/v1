import React from "react";
import { ParallaxProvider } from "react-scroll-parallax";

const withParallax =
  <Props,>(Component: React.ComponentType<Props>) =>
  (props: Props) =>
    (
      <ParallaxProvider>
        <Component {...props} />
      </ParallaxProvider>
    );

export default withParallax;
