import { useState } from 'react';
import Swal from 'sweetalert2';
import Fade from './Fade';
import { ContentHeader } from './content';

export default function Form() {
  const [invitationRequest, setInvitationRequest] = useState({
    name: '',
    email: '',
    role: '',
    major: '',
    resume: '',
    interests: '',
    skills: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const autoExpand = (target) => {
    /* eslint-disable no-param-reassign */
    target.style.height = 'inherit';
    target.style.height = `${target.scrollHeight}px`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvitationRequest({ ...invitationRequest, [name]: value });

    autoExpand(e.target);
  };

  return (
    <Fade>
      <form
        className="w-full max-w-2xl p-4"
        onSubmit={ (e) => {
          e.preventDefault();
          setSubmitted(true);
          const data = new FormData();
          for (const [key, value] of Object.entries(invitationRequest)) {
            data.append(key, value);
          }

          fetch(
            'https://script.google.com/macros/s/AKfycbyr9M13gnlVxM8UYocXy7wKJZQPnxd_iq043N2ZZPh0elrH4Bw/exec',
            { method: 'POST', body: data },
          )
            .then(() => {
              Swal.fire(
                'Success!',
                'Invitation request form submitted.',
                'success',
              );
            })
            .catch(() => {
              Swal.fire(
                'There was an error submitting the form.',
                'Please try again later or contact us at version1@umich.edu',
                'error',
              );
            }).finally(() => {
              setSubmitted(false);
              setInvitationRequest({
                name: '',
                email: '',
                role: '',
                major: '',
                resume: '',
                interests: '',
                skills: '',
              });
            });
        } }

      >
        <ContentHeader title="Request to join now" />
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2">
            <div className="px-3 mb-6">
              <label
                className="block text-gray-100 text-lg mb-2"
                htmlFor="name"
              >
                Name
                {' '}
                <span className="text-red-800">*</span>
                <input
                  name="name"
                  id="name"
                  className="mt-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                  type="text"
                  placeholder="Jim Harbaugh"
                  onChange={ handleInputChange }
                  value={ invitationRequest.name }
                  required
                />
              </label>
            </div>
            <div className="px-3 mb-6">
              <label
                className="block text-gray-100 text-lg mb-2"
                htmlFor="email"
              >
                Email
                {' '}
                <span className="text-red-800">*</span>
                <input
                  name="email"
                  id="email"
                  className="mt-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                  type="text"
                  placeholder="Email"
                  onChange={ handleInputChange }
                  value={ invitationRequest.email }
                  required
                />
              </label>
            </div>
            <div className="px-3 mb-6">
              <label
                className="block text-gray-100 text-lg mb-2"
                htmlFor="major"
              >
                Major
                {' '}
                <span className="text-red-800">*</span>
                <input
                  name="major"
                  id="major"
                  className="mt-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                  type="text"
                  placeholder="CS, UX, Business, Engineering, etc."
                  onChange={ handleInputChange }
                  value={ invitationRequest.major }
                  required
                />
              </label>
            </div>
            <div className="px-3 mb-6">
              <label
                className="block text-gray-100 text-lg mb-2"
                htmlFor="role"
              >
                Role
                {' '}
                <span className="text-red-800">*</span>
                <div className="relative mt-2">
                  <select
                    name="role"
                    id="role"
                    onChange={ handleInputChange }
                    value={ invitationRequest.role }
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-500"
                    required
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
              </label>
            </div>
            <div className="px-3 mb-6">
              <label
                className="mt-2 block text-gray-100 text-lg mb-2"
                htmlFor="resume"
              >
                Resume
                {' '}
                <span className="text-red-800">*</span>
                <input
                  name="resume"
                  id="resume"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                  type="text"
                  placeholder="Link to Drive, Dropbox, etc. (e.g. https://drive.google.com/file/d/1BZq0nadzuQK6pttUwnW8RmYWIxmekgZG/view)"
                  onChange={ handleInputChange }
                  value={ invitationRequest.resume }
                  required
                />
              </label>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex flex-col">
              <div className="px-3 mb-4">
                <label
                  className="block text-gray-100 text-lg mb-2"
                  htmlFor="interests"
                >
                  What types of projects are you interested in?
                  {' '}
                  <span className="text-red-800">*</span>
                  <textarea
                    name="interests"
                    htmlFor="interests"
                    onChange={ handleInputChange }
                    className="mt-2 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100 resize border rounded focus:outline-none focus:shadow-outline md:h-32 h-20"
                    placeholder="E.g. Consumer social products, tools for students, anything involving machine learning"
                    value={ invitationRequest.interests }
                    required
                  />
                </label>
              </div>
              <div className="px-3 mb-6 flex-grow">
                <label
                  className="block text-gray-100 text-lg mb-2"
                  htmlFor="skills"
                >
                  What are your skills?
                  {' '}
                  <span className="text-red-800">*</span>
                  <textarea
                    name="skills"
                    id="skills"
                    onChange={ handleInputChange }
                    className="mt-2 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100 resize border rounded focus:outline-none focus:shadow-outline md:h-32 h-20"
                    placeholder="E.g. logo design, python, ReactJS, machine learning"
                    value={ invitationRequest.skills }
                    required
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center pb-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-200 to-yellow-500 hover:bg-blue-500 text-gray-800 font-semibold py-2 px-4 rounded shadow mb-4"
            disabled={ submitted }
          >
            Request an invite
          </button>
        </div>
      </form>
    </Fade>
  );
}
