import InternalLink from "./Link";

const ConditionalLink = ({
  href,
  children,
}: {
  href?: string;
  children: JSX.Element;
}) => (href ? <InternalLink href={href}>{children}</InternalLink> : children);

export default ConditionalLink;
