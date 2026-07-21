import Link from 'next/link';

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export default function AuthFooter({
  text,
  linkText,
  href,
}: AuthFooterProps) {
  return (
    <div className="mt-8 text-center">

      <p className="text-sm text-rexo-muted">
        {text}
      </p>

      <Link
        href={href}
        className="
          mt-2
          inline-block
          font-semibold
          text-rexo-primary
          transition
          hover:underline
        "
      >
        {linkText}
      </Link>

    </div>
  );
}