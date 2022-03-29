const PARTNERS = [
  {
    name: "Y Combinator",
    link: "https://ycombinator.com",
    image: "/partners/yc.png",
  },
];

const Partners = () => (
  <div>
    <h2>Partners</h2>
    <p>
      We partner with outstanding organizations to create extraordinary projects
      and connect our members with exclusive opportunities.
    </p>
    <div>
      {PARTNERS.map(({ name, link, image }) => (
        <p>{name}</p>
      ))}
    </div>
  </div>
);

export default Partners;
