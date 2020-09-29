import { useState } from 'react';
import Swal from 'sweetalert2';

import { ContentHeader } from './content';

export default function Form() {
  const [invitationRequest, setInvitationRequest] = useState({
    name: '',
    role: '',
    major: '',
    resume: '',
    interests: '',
    skills: '',
  });
  const [, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvitationRequest({ ...invitationRequest, [name]: value });
  };

  return (
    <form className="w-full max-w-2xl p-4">
      <ContentHeader title="Request to join now" />
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2">
          <div className="px-3 mb-6">
            <label className="block text-gray-100 text-lg font-bold mb-2" htmlFor="name">
              Name
              <input
                name="name"
                id="name"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                type="text"
                placeholder="Jim Harbaugh"
                onChange={ handleInputChange }
                value={ invitationRequest.name }
              />
            </label>
          </div>
          <div className="px-3 mb-6">
            <label className="block text-gray-100 text-lg font-bold mb-2" htmlFor="major">
              Major
              <input
                name="major"
                id="major"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                type="text"
                placeholder="CS, UX, Business, Engineering, etc."
                onChange={ handleInputChange }
                value={ invitationRequest.major }
              />
            </label>
          </div>
          <div className="px-3 mb-6">
            <label className="block text-gray-100 text-lg font-bold mb-2" htmlFor="role">
              Role
              <div className="relative">
                <select
                  name="role"
                  id="role"
                  onChange={ handleInputChange }
                  value={ invitationRequest.role }
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
            </label>
          </div>
          <div className="px-3 mb-6">
            <label className="block text-gray-100 text-lg font-bold mb-2" htmlFor="resume">
              Resume
              <input
                name="resume"
                id="resume"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                type="text"
                placeholder="Link to Drive, Dropbox, etc."
                onChange={ handleInputChange }
                value={ invitationRequest.resume }
              />
            </label>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex flex-col">
            <div className="px-3 mb-4">
              <label className="block text-gray-100 text-lg font-bold mb-2" htmlFor="interests">
                What types of projects are you interested in?
                <textarea
                  name="interests"
                  htmlFor="interests"
                  onChange={ handleInputChange }
                  className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100 resize border rounded focus:outline-none focus:shadow-outline md:h-24 h-12"
                  value={ invitationRequest.interests }
                 />
              </label>
            </div>
            <div className="px-3 mb-6 flex-grow">
              <label className="block text-gray-100 text-lg font-bold mb-2" htmlFor="skills">
                What are your skills?
                <textarea
                  name="skills"
                  id="skills"
                  onChange={ handleInputChange }
                  className="w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100 resize border rounded focus:outline-none focus:shadow-outline md:h-24 h-12"
                  value={ invitationRequest.skills }
                 />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center pb-4">
        <button
          type="button"
          className="bg-gradient-to-r from-yellow-200 to-yellow-500 hover:bg-blue-500 text-gray-800 font-semibold py-2 px-4 rounded shadow mb-4"
          onClick={ () => {
            const data = new FormData();
            for (const [key, value] of Object.entries(invitationRequest)) { // eslint-disable-line
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
              });
            setSubmitted(true);
            setInvitationRequest({
              name: '',
              role: '',
              major: '',
              resume: '',
              interests: '',
              skills: '',
            });
          } }
        >
          Request an invite
        </button>
      </div>
    </form>
  );
}
