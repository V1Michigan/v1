import NextStepCard from "./NextStepCard";

interface OnboardingCohortRegisterProps {
  submitted: boolean;
  handleSubmit: () => void | Promise<void>;
}

// Once people are confirmed for a cohort, we probably shouldn't show this
const OnboardingCohortRegister = ({
  submitted,
  handleSubmit,
}: OnboardingCohortRegisterProps) => (
  <NextStepCard
    title="Join a V1 Onboarding Cohort"
    description={
      submitted
        ? "Great! ✅ We'll reach out to you via email soon."
        : `
        V1 provides the most driven students with an extraordinary
        network, exclusive opportunities within startups, and mentorship
        to grow and achieve great things, together. Start the process to
        become an official V1 member today.
      `
    }
    buttonText={submitted ? undefined : "I'm interested"}
    disabled={submitted}
    onClick={handleSubmit}
  />
);

export default OnboardingCohortRegister;
