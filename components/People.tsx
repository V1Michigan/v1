import Marquee from "react-fast-marquee";
import Fade from "./Fade";

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
    className="h-full w-full"
    src={`/people/${name}.png`}
    alt={name}
  />
);

const People = () => (
  <>
    <Fade className="relative" motion={false}>
      <Marquee speed={40} gradient={false} style={{ zIndex: 0 }}>
        <div className="grid grid-flow-col md:grid-rows-[25vh_25vh] grid-rows-[12vh_12vh] overflow-x-hidden">
          {TEAM.map((name) => (
            <Person key={name} name={name} />
          ))}
        </div>
      </Marquee>
      <div
        className="
          absolute top-0 left-0 right-0 bottom-0
          flex justify-center items-center z-10
          bg-gradient-to-r to-white/30 via-black/70 from-white/30
        "
      >
        <h2 className="text-6xl text-white font-bold">Our people</h2>
      </div>
    </Fade>

    <div className="bg-gray-300">
      <div className="max-w-4xl mx-auto py-12 px-4 leading-snug">
        <p className="tracking-tightest text-gray-900 text-3xl">
          With V1, you&apos;ll not only build incredible projects, you&apos;ll
          build them with exceptional people who will push you to be the best
          version of ourself.
        </p>
        <p className="tracking-tightest text-gray-900 text-2xl mt-4">
          V1 invests in people with high growth potential — people that will
          grow faster than we can ever imagine.
        </p>
        <p className="tracking-tightest text-gray-900 text-2xl mt-4">
          We don&apos;t require applications. We don&apos;t have an interview
          process. We won&apos;t judge you based on your prior experiences. We
          look for energy, drive, and initiative.
        </p>
        <p className="font-semibold text-gray-900 text-3xl mt-8 text-center">
          Sound like you?
        </p>
      </div>
    </div>
  </>
);

const PeopleChips = () => (
  // Would be fun to animate these, e.g. shuffle/carousel them
  <Fade motion={false} className="-space-x-4 mb-4 ">
    {TEAM.map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .slice(0, 15)
      .map(({ value }) => value)
      .map((member) => (
        <img
          className="relative z-10 inline object-cover w-12 h-12 border-2 border-white rounded-full"
          src={`/people/${member}.png`}
          alt={`Profile for ${member}`}
          key={member}
        />
      ))}
  </Fade>
);

export { People as default, PeopleChips };
