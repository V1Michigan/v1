import { ContentPage } from "./content";

const What = () => (
  <ContentPage
    title="What is V1?"
    nextLink="#special"
    nextLinkText="What makes these projects special?"
    textElement={
      <div>
        <p className="text-2xl text-gray-custom text-center">
          V1 is a monthly newsletter for ambitious engineering and design
          students at the University of Michigan who are looking to
          <span className="font-bold italic"> build something great.</span>
        </p>
        <p className="text-2xl text-gray-custom text-center pt-10">
          Each month, we&apos;ll share a curated list of high-potential side
          projects and startups on campus{" "}
          <span className="font-bold italic">
            {" "}
            looking for your help to build their V1&mdash; the first version of
            their product.
          </span>
        </p>
      </div>
    }
  />
);

const Special = () => (
  <ContentPage
    title="Why are V1 projects special?"
    nextLink="#expect"
    nextLinkText="What can you expect as a member?"
    textElement={
      <div>
        <table>
          <tr>
            <td>
              <p className="text-2xl text-gray-custom py-5">
                <span
                  className="text-gradient bg-gradient-to-r
                               from-yellow-200 to-yellow-500 "
                >
                  They&apos;re really early.{" "}
                </span>
                This means you&apos;ll get to shape the user experience, develop
                the product from the ground up, and leave a mark that will last.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-2xl text-gray-custom py-5">
                <span
                  className="text-gradient bg-gradient-to-r
                                   from-yellow-200 to-yellow-500 "
                >
                  They have a rockstar team.{" "}
                </span>
                We personally vet each project added to the platform, and ensure
                the team knows what they are doing and want to succeed.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-2xl text-gray-custom py-5">
                <span
                  className="text-gradient bg-gradient-to-r
                                   from-yellow-200 to-yellow-500 "
                >
                  They&apos;re solving a real need.{" "}
                </span>
                We look for projects that can actually make a difference in the
                world.
              </p>
            </td>
          </tr>
        </table>
      </div>
    }
  />
);

const Expect = () => (
  <ContentPage
    title="What to expect as a member."
    nextLink="#request"
    nextLinkText="Request an invite"
    textElement={
      <div>
        <table>
          <tr>
            <td>
              <p className="text-2xl text-gray-custom py-5">
                <span className="text-gradient bg-gradient-to-r from-yellow-200 to-yellow-500">
                  Monthly emails featuring our most exciting projects.{" "}
                </span>
                At the end of each month, you'll receive an email featuring our
                most highly-vetted projects and what they need help on.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-2xl text-gray-custom py-5">
                <span
                  className="text-gradient bg-gradient-to-r
                                   from-yellow-200 to-yellow-500 "
                >
                  Regular, direct matches based on your interests.{" "}
                </span>
                In addition to monthly emails, we&apos;ll reach out directly
                when we think there&apos;s a strong match between your interests
                and skills and the team&apos;s needs.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p className="text-2xl text-gray-custom py-5">
                <span
                  className="text-gradient bg-gradient-to-r
                                   from-yellow-200 to-yellow-500"
                >
                  Continuous, personal support.{" "}
                </span>
                As our community grows, we will strive to find new ways to
                support you as an individual. What you get today is only a
                fraction of what&apos;s to come.
              </p>
            </td>
          </tr>
        </table>
      </div>
    }
  />
);

export { What, Special, Expect };
