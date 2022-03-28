import Marquee from "react-fast-marquee";

const TEAM = [
  "alaa",
  "aditya",
  "advait",
  "dheera",
  "divya",
  "drew",
  "elliot",
  "emir",
  "jon",
  "kalman",
  "leon",
  "liv",
  "lucas",
  "madhav",
  "megan",
  "nathan",
  "pasha",
  "raghav",
  "reese",
  "samay",
  "tyrus",
  "varun",
  "vishnu",
  "yash",
];

const Person = ({ name }: { name: string }) => (
  <img
    // TODO: Should we link to people's LinkedIn? Then this transition would be cool
    // className="transition hover:scale-95 hover:shadow-inner"
    src={`/people/${name}.png`}
    alt={name}
  />
);

const People = () => (
  <Marquee speed={40} gradient={false}>
    <div
      className="
        grid grid-flow-col md:grid-rows-[repeat(2,_8rem)] md:auto-cols-[8rem]
        grid-rows-[repeat(2,_4rem)] auto-cols-[4rem]
        overflow-x-hidden
      "
    >
      {TEAM.map((name) => (
        <Person key={name} name={name} />
      ))}
    </div>
  </Marquee>
);

export default People;
