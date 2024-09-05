import Fade from "./Fade";

const PARTNERS = [
  // {
  //   name: "Ramp",
  //   link: "https://ramp.com/",
  //   image: "/partners/ramp.svg",
  // },
  {
    name: "Neo",
    link: "https://neo.com/",
    image: "/partners/neo.png",
  },
  {
    name: "Contrary",
    link: "https://contrary.com/",
    image: "/partners/contrary.svg",
  },
  {
    name: "Y Combinator",
    link: "https://ycombinator.com",
    image: "/partners/yc.png",
  },
  {
    name: "a16z",
    link: "https://a16z.com/",
    image: "/partners/a16z.png",
  },
  // {
  //   name: "Cahoots",
  //   link: "https://cahoots.com/",
  //   image: "/partners/cahoots.png",
  // },
];

const Partners = () => (
  <div>
    <h2 className="text-center text-3xl md:text-5xl text-black font-bold py-6">
      Partners
    </h2>
    <p className="tracking-tight text-gray-900 text-2xl max-w-4xl mx-auto py-2 px-4 leading-snug text-center">
      We partner with outstanding organizations to build extraordinary projects
      and connect our members with exclusive opportunities.
    </p>
    <Fade motion={false}>
      <div className="max-w-5xl mx-auto p-8 pb-12 flex flex-wrap items-center justify-around gap-x-8 gap-y-8">
        {PARTNERS.map(({ name, link, image }) => (
          <a key={name} className="shrink-0" href={link}>
            <img className="h-12 hover:opacity-75" alt={name} src={image} />
          </a>
        ))}
      </div>
    </Fade>
  </div>
);

export default Partners;
