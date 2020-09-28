import { useState } from "react";

export default function Form() {
  const [invitationRequest, setInvitationRequest] = useState({
    name: "",
    role: "",
    major: "",
    resume: "",
    interests: "",
    skills: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setInvitationRequest({ ...invitationRequest, [name]: value });
  };

  return (
    <form className="w-full max-w-2xl p-4">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2">
          <div className="px-3 mb-6">
            <label className="block text-gray-100 text-sm font-bold mb-2">
              Name
            </label>
            <input
              name="name"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
              type="text"
              placeholder="Jim Harbaugh"
              onChange={handleInputChange}
              value={invitationRequest.name}
            />
          </div>
          <div className="px-3 mb-6">
            <label className="block text-gray-100 text-sm font-bold mb-2">
              Major
            </label>
            <input
              name="major"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
              type="text"
              placeholder="CS, UX, Business, Engineering, etc."
              onChange={handleInputChange}
              value={invitationRequest.major}
            />
          </div>
          <div className="px-3 mb-6">
            <label className="block text-gray-100 text-sm font-bold mb-2">
              Role
            </label>
            <div className="relative">
              <select
                name="role"
                onChange={handleInputChange}
                value={invitationRequest.role}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-500"
              >
                <option value="" disabled selected>
                  Role
                </option>
                <option value="Designer">Designer</option>
                <option value="Engineer">Engineer</option>
                <option value="Other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="px-3 mb-6">
            <label className="block text-gray-100 text-sm font-bold mb-2">
              Resume
            </label>
            <input
              name="resume"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
              type="text"
              placeholder="Link to Drive, Dropbox, etc."
              onChange={handleInputChange}
              value={invitationRequest.resume}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex flex-col">
            <div className="px-3 mb-4">
              <label className="block text-gray-100 text-sm font-bold mb-2">
                What types of projects are you interested in?
              </label>

              <textarea
                name="interests"
                onChange={handleInputChange}
                className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100 resize border rounded focus:outline-none focus:shadow-outline md:h-24 h-12"
                value={invitationRequest.interests}
              ></textarea>
            </div>
            <div className="px-3 mb-6">
              <label className="block text-gray-100 text-sm font-bold mb-2">
                What are your skills?
              </label>
              <textarea
                name="skills"
                onChange={handleInputChange}
                className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100 resize border rounded focus:outline-none focus:shadow-outline md:h-24 h-12"
                value={invitationRequest.skills}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center pb-4">
        <button
          type="button"
          className="bg-gradient-to-r from-yellow-200 to-yellow-500 hover:bg-blue-500 text-gray-800 font-semibold py-2 px-4 rounded shadow mb-4"
          onClick={() => {
            var data = new FormData();
            for (var key in invitationRequest) {
              data.append(key, invitationRequest[key]);
            }

            fetch(
              "https://script.google.com/macros/s/AKfycbyr9M13gnlVxM8UYocXy7wKJZQPnxd_iq043N2ZZPh0elrH4Bw/exec",
              { method: "POST", body: data }
            )
              .then(response => {
                console.log("Invitation request form submitted.");
              })
              .catch(error => {
                console.error("Error!", error.message);
                alert(
                  "There was an error submitting the form. Please try again."
                );
              });
            setSubmitted(true);
            setInvitationRequest({
              name: "",
              role: "",
              major: "",
              resume: "",
              interests: "",
              skills: ""
            });
          }}
        >
          {submitted ? "Request received. We'll be in touch." : "Request an invite"}
        </button>
      </div>
    </form>
  );
}
