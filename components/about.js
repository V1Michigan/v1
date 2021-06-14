import { ContentPage } from "./content";
import Link from "next/link";

const What = () => (
  <ContentPage
    title="What is V1?"
    textElement={
      <div className="mx-auto max-w-2xl">
        <p className="text-2xl text-gray-900">
          The University of Michigan is a big school. Currently, there are a lot
          of entrepreneurial resources that incredibly valuable, yet niche and
          selective. It's also difficult to connect and collaborate with other
          builders across campus.
        </p>

        <p className="text-2xl text-gray-900 pt-10">
          <b>
            V1 is the community for ambitious student builders at the University
            of Michigan.{" "}
          </b>
          At our core, we support students who are working on side-projects and
          startups — those who are looking to build{" "}
          <i>
            their <b>V1</b>
          </i>
          : the first version of their product.
        </p>
      </div>
    }
  />
);

const Offer = () => (
  <ContentPage
    title="What does V1 offer?"
    textElement={
      <div className="mx-auto max-w-2xl">
        <p className="text-2xl text-gray-900">
          V1 offers an engaged online community for student builders to connect
          and collaborate. Not only do we share exclusive opportunities, but we
          also host weekly fireside chats with industry leaders and Michigan
          alum. Lastly, we offer a number of internal resources to help student
          builders navigate the Michigan entrepreneurial ecosystem.
        </p>
        <p className="text-2xl text-gray-900 pt-10">
          In the past, we've had speakers like the founder of Morning Brew, the
          president of Y Combinator, employees at unicorn startups, and more.
        </p>
      </div>
    }
  />
);

const team = [
  {
    image: "/community/samay.jpg",
    name: "Samay Shamdasani",
    role: "Director",
    link: "https://shamdasani.org",
  },
  {
    image: "/community/dheera.jpg",
    name: "Dheera Vuppala",
    role: "Director",
    link: "https://www.linkedin.com/in/dheeravuppala/",
  },
  {
    image: "/community/raghav.jpg",
    name: "Raghav Bhat",
    role: "Head of Engineering",
    link: "https://www.linkedin.com/in/raghav-bhat-02/",
  },
  {
    image: "/community/saanika.jpg",
    name: "Saanika Kulkarni",
    role: "Head of Content",
    link: "https://www.linkedin.com/in/saanikak/",
  },
  {
    image: "/community/isaac.jpeg",
    name: "Isaac Fung",
    role: "Head of Engineering",
    link: "https://www.linkedin.com/in/i-fung/",
  },
  {
    image: "/community/drew.jpeg",
    name: "Drew Levine",
    role: "Head of Community",
    link: "https://www.linkedin.com/in/drew-levine-156a99159/",
  },
  {
    image: "/community/advait.jpeg",
    name: "Advait Iyer",
    role: "Core Member",
    link: "https://www.linkedin.com/in/advaitiyer/",
  },
  {
    image: "/community/divya.jpg",
    name: "Divya Reddy",
    role: "Core Member",
    link: "https://www.linkedin.com/in/advaitiyer/",
  },
];
const advisors = [
  {
    image: "/community/sean.jpg",
    name: "Sean Stapleton",
    role: "Advisor",
    link: "https://www.linkedin.com/in/seancstapleton/",
  },
  {
    image: "/community/dar.jpg",
    name: "Dar Sleeper",
    role: "Advisor",
    link: "https://www.linkedin.com/in/darsleeper/",
  },
  {
    image: "/community/ellie.jpg",
    name: "Elizabeth Day",
    role: "Advisor",
    link: "https://www.linkedin.com/in/elizabeth-day-418a3b181/",
  },
  {
    image: "/community/varun.jpg",
    name: "Varun Jindal",
    role: "Advisor",
    link: "https://www.linkedin.com/in/varun-jindal/",
  },
]
const Leaders = ({team, title}) => (
  <ContentPage
    title={ title }
    textElement={
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap justify-center">
          {team.map((member) => (
            <a className="m-2" href={member.link}>
              <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg m-2">
                <img
                  className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                  src={member.image}
                />
                <div className="flex-grow">
                  <h2 className="text-gray-900 title-font font-medium">
                    {member.name}
                  </h2>
                  <p className="text-gray-500">{member.role}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    }
  />
);

const Leadership = () => (
  <Leaders title="V1 Leadership" team={team} />
)

const Advisors = () => (
  <Leaders title="V1 Advisors" team={advisors} />
)

const members = [
  "payal",
  "ryan",
  "dheera",
  "samay",
  "saanika",
  "sean",
  "allison",
  "ellie",
  "yash",
  "varun",
  "divya",
  "abdullah",
  "medha",
  "raghav",
];

const Join = () => (
  <ContentPage
    title="You're in the right place."
    textElement={
      <div className="text-center">
        <div className="-space-x-4 mb-4 ">
          {members.sort().map((member) => (
            <img
              class="relative z-10 inline object-cover w-12 h-12 border-2 border-white rounded-full"
              src={`/community/${member}.jpg`}
              alt="Profile image"
            />
          ))}
        </div>

        <span class="relative inline-flex mt-2">
          <span class="inline-flex items-center px-4 py-2 text-base leading-6 font-medium rounded-md text-gray-800 bg-gray-200 hover:text-gray-700 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
            50+ online now
          </span>
          <span class="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </span>

        <div className="block">
          <Link href="/community">
            <button
              type="button"
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:bg-blue-500 text-gray-100 font-semibold py-3 px-4 rounded shadow mt-5 hover:opacity-75"
            >
              Join the community ›
            </button>
          </Link>
        </div>
      </div>
    }
  />
);

// Remake this component
// const Expect = () => (
//   <ContentPage
//     title="What do we offer?"
//     nextLink="#request"
//     nextLinkText="Request an invite"
//     textElement={
//       <div>
//         <table>
//           <tr>
//             <td>
//               <p className="text-2xl text-gray-custom py-5">
//                 <span className="text-gradient bg-gradient-to-r from-yellow-200 to-yellow-500">
//                   Monthly emails featuring our most exciting projects.&nbsp;
//                 </span>
//                 At the end of each month, you&apos;ll receive an email featuring
//                 our most highly-vetted projects and what they need help on.
//               </p>
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <p className="text-2xl text-gray-custom py-5">
//                 <span
//                   className="text-gradient bg-gradient-to-r
//                                    from-yellow-200 to-yellow-500 "
//                 >
//                   Regular, direct matches based on your interests.&nbsp;
//                 </span>
//                 In addition to monthly emails, we&apos;ll reach out directly
//                 when we think there&apos;s a strong match between your interests
//                 and skills and the team&apos;s needs.
//               </p>
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <p className="text-2xl text-gray-custom py-5">
//                 <span
//                   className="text-gradient bg-gradient-to-r
//                                    from-yellow-200 to-yellow-500"
//                 >
//                   Continuous, personal support.&nbsp;
//                 </span>
//                 As our community grows, we will strive to find new ways to
//                 support you as an individual. What you get today is only a
//                 fraction of what&apos;s to come.
//               </p>
//             </td>
//           </tr>
//         </table>
//       </div>
//     }
//   />
// );

export { What, Offer, Join, Leadership, Advisors };
