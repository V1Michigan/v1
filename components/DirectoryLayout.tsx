import Link from "next/link";
// import bg from "/public/landing.jpg";

type LayoutProps = {
  title: string;
  description: string;
  link: string;
};

const DirectoryLayout = (props: LayoutProps) => {
  const { title, description, link } = props;
  return (
    <div className="w-full p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-screen-2xl relative w-full">
        <div className="max-w-screen-2xl w-full">
          <div
            className="w-full rounded-2xl p-16"
            style={{
              height: "400px",
            /* backgroundImage: `url(${bg.src})`, */ background: "#a0a0a0",
            }}
          >
            <h1 className="font-bold text-white text-3xl mb-6">{title}</h1>
            <h3 className="font-regular text-white text-2xl mb-9">{description}</h3>
            {link ?? (
              <a
                className="text-white"
                href={link}
                target="_blank"
                rel="noreferrer"
              >
                Register a Startup
              </a>
            )}
          </div>
          <div
            style={{ height: "88px" }}
            className="mx-8 absolute bottom-0 bg-yellow-400 block"
          >
            Filters
          </div>
        </div>
      </div>
      <div className="w-full max-w-screen-2xl mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array(10).fill(null).map(() => (<div className="bg-blue-500 w-full">Insert card component here</div>))}
      </div>
    </div>
  )
};

export default DirectoryLayout;
