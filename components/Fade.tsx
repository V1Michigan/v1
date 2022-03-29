import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

interface FadeProps {
  children: JSX.Element | JSX.Element[];
  motion?: boolean;
  className?: string;
}

export default function Fade({
  children,
  motion = true,
  className = "",
}: FadeProps) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const domNode = domRef.current;
    if (domNode) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => setVisible(entry.isIntersecting));
      });
      observer.observe(domNode);
      return () => observer.unobserve(domNode);
    }
    return undefined;
  }, []);
  return (
    <div
      className={`${className} fade-in ${motion ? "fade-in-motion" : ""} ${
        isVisible ? "is-visible" : ""
      }`}
      ref={domRef}
    >
      {children}
    </div>
  );
}

Fade.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.objectOf(PropTypes.symbol)),
    PropTypes.objectOf(PropTypes.symbol),
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};
