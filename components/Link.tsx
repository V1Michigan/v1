import NextLink from "next/link";

interface LinkProps {
  href: string;
}

// Use this component instead of next/Link for internal links,
// <a> is still good for external links

// It's good to use next/Link for internal links (fast page transitions!),
// but the API is really bad (can't have another <a> tag inside to preview
// the href when you hover over the link...)

const InternalLink = ({
  children,
  href,
  ...props
}: LinkProps & React.HTMLProps<HTMLAnchorElement>) => (
  <NextLink href={href} passHref>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <a href={href} {...props}>
      {children}
    </a>
  </NextLink>
);

export default InternalLink;
