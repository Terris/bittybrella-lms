import Link, { LinkProps } from "next/link";

interface TextLinkProps extends LinkProps {
  children: React.ReactNode;
}

export function TextLink({ children, ...rest }: TextLinkProps) {
  return (
    <Link className="color-primary" {...rest}>
      {children}
    </Link>
  );
}
