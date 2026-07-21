interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">

      <div
        className="
          mx-auto
          mb-5
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-rexo-primary
          text-2xl
          font-bold
          text-white
        "
      >
        R
      </div>

      <h1
        className="
          text-3xl
          font-black
          text-rexo
        "
      >
        {title}
      </h1>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-rexo-muted
        "
      >
        {subtitle}
      </p>

    </div>
  );
}