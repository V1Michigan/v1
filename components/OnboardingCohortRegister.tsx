interface OnboardingCohortRegisterProps {
  submitted: boolean;
  handleSubmit: () => void | Promise<void>;
}

// Once people are confirmed for a cohort, we probably shouldn't show this
const OnboardingCohortRegister = ({ submitted, handleSubmit }: OnboardingCohortRegisterProps) => (
  <div className="bg-gray-100 max-w-sm rounded-md p-4 text-center">
    <h1 className="font-bold tracking-tight text-xl text-gray-900 mb-2">
      Join a V1 Onboarding Cohort
    </h1>
    <h2 className="text-gray-800">
      {submitted ? (
        <>
          Great! ✅ We&apos;ll reach out to you via email soon.
        </>
      ) : (
        <>
          V1 provides the most driven students with an extraordinary
          network, exclusive opportunities within startups, and mentorship
          to grow and achieve great things, together. Start the process to
          become an official V1 member today.
        </>
      )}
    </h2>
    <button
      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-500 text-gray-100 font-semibold py-3 px-4 rounded shadow mt-3 hover:opacity-75 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
      disabled={ submitted }
      onClick={ handleSubmit }
    >
      I&apos;m interested &#8250;
    </button>
  </div>
);

export default OnboardingCohortRegister;
