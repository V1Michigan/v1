import Fade from "./Fade";

const PARTNERS = [
  {
    name: "Y Combinator",
    link: "https://ycombinator.com",
    image: "partners/yc.png",
  },
  {
    name: "Contrary",
    link: "https://contrary.com/",
    image: "/partners/contrary.svg",
  },
  {
    name: "Neo",
    link: "https://neo.com/",
    image: "/partners/Neo.png",
  },
  {
    name: "Cahoots",
    link: "https://cahoots.com/",
    image: "/partners/Cahoots.png",
  },
  {
    name: "Ramp",
    link: "https://ramp.com/",
    image: "/partners/ramp.svg",
  },
];

const Partners = () => (
  <Fade motion={false}>
    <div>
      <h2 className="flex items-center justify-around text-4xl md:text-6xl text-black font-bold py-6">
        Partners
      </h2>
      <p className="tracking-tight text-gray-900 text-3xl max-w-4xl mx-auto py-2 px-4 leading-snug">
        We partner with outstanding organizations to create extraordinary
        projects and connect our members with exclusive opportunities.
      </p>
      <div className="flex items-center justify-around">
        {PARTNERS.map(({ name, link, image }) => (
          <a href={link}>
            <p className="justify-around md:text-2xl text-black font-semibold">
              {name}
            </p>
            <img alt={name} src={image} />
          </a>
        ))}
      </div>
    </div>
  </Fade>
);

export default Partners;
