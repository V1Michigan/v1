import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

interface FadeProps {
  children: JSX.Element | JSX.Element[];
}

export default function Fade({ children }: FadeProps) {
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
      className={ `fade-in-section ${isVisible ? "is-visible" : ""}` }
      ref={ domRef }
    >
      { children }
    </div>
  );
}

const FadeAllChildren = ({ children }: {children: JSX.Element[]}) => (
  <>
    {children.map((child) => (
      <Fade>
        {child}
      </Fade>
    ))}
  </>
);

export { FadeAllChildren };

Fade.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.objectOf(
        PropTypes.symbol,
      ),
    ),
    PropTypes.objectOf(
      PropTypes.symbol,
    ),
    PropTypes.arrayOf(
      PropTypes.element,
    ),
    PropTypes.element,
  ]).isRequired,
};
