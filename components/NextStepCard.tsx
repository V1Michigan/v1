import Link from "next/link";

const ConditionalLink = ({ href, children }: {href?: string, children: JSX.Element}) => (
  href ? (
    <Link href={ href } passHref>
      {children}
    </Link>
  ) : (
    children
  )
);

interface NextStepCardProps {
  title: string;
  description: string;
  buttonText: string; // Omit right chevron icon, that's included in the button :)
  disabled?: boolean;
  // Provide exactly one of these
  href?: string;
  onClick?: () => void | Promise<void>;
}

const NextStepCard = ({
  title, description, buttonText, disabled, href, onClick,
}: NextStepCardProps) => (
  <div className="bg-gray-100 max-w-sm rounded-md p-4 text-center flex flex-col">
    <h1 className="font-bold tracking-tight text-xl text-gray-900 mb-2">
      {title}
    </h1>
    <h2 className="text-gray-800">
      {description}
    </h2>
    <div className="mt-auto">
      <ConditionalLink href={ href }>
        <button
          className="
            mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-gray-100 font-semibold py-3 px-4 rounded shadow
            hover:bg-blue-500 hover:opacity-75
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          onClick={ onClick }
          disabled={ disabled }
          type="button"
        >
          {buttonText}
          {" "}
          &rsaquo;
        </button>
      </ConditionalLink>
    </div>
  </div>
);

export default NextStepCard;
