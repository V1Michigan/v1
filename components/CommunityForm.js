import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

import Fade from './Fade';
import { ContentHeader } from './content';

export default function Form() {
  const [invitationRequest, setInvitationRequest] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const autoExpand = (target) => {
    target.style.height = 'inherit';
    target.style.height = target.scrollHeight + 'px';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvitationRequest({ ...invitationRequest, [name]: value });
    
    autoExpand(e.target);
  };

  return (
    <Fade>
      <form
        className="w-full p-4"
        onSubmit={ (e) => {
          e.preventDefault();
          setSubmitted(true);
          const data = new FormData();
          for (const [key, value] of Object.entries(invitationRequest)) {
            data.append(key, value);
          }

          axios.post(
            'https://script.google.com/macros/s/AKfycbxcvZeIseDF-s5b6fNco4SZdZB68PLAM1P8zIDS4JDgIxWFECnQZJws/exec', data
          ).then(res => {
            if (res.data.result === "success") {
              window.location.href = "https://discord.gg/G3Hfkcm3hH";
            } else {
              Swal.fire(
                'There was an error submitting the form.',
                'Please try again later or contact us at team@v1michigan.com',
                'error',
              );
            }
          }).finally(() => {
            setSubmitted(false);
            setInvitationRequest({
              name: '',
              email: ''
            });
          });
        } }

      >
        <div>
          <div className="w-full">
            <div className="px-3 mb-6">
              <label
                className="block text-gray-100 text-lg mb-2"
                htmlFor="name"
              >
                Full Name <span className="text-red-800">*</span>
                <input
                  name="name"
                  id="name"
                  className="mt-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                  type="text"
                  placeholder="Billy Magic"
                  onChange={ handleInputChange }
                  value={ invitationRequest.name }
                  required
                  disabled={submitted}
                />
              </label>
            </div>
            <div className="px-3 mb-6">
              <label
                className="block text-gray-100 text-lg mb-2"
                htmlFor="email"
              >
                Email <span className="text-red-800">*</span>
                <input
                  name="email"
                  id="email"
                  className="mt-2 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-100"
                  type="text"
                  placeholder="Email"
                  onChange={ handleInputChange }
                  value={ invitationRequest.email }
                  required
                  disabled={submitted}
                />
              </label>
            </div>
            <div className="px-3 mt-10 mb-6">
              <button
                type="submit"
                className={`bg-gradient-to-r from-yellow-200 to-yellow-500 hover:opacity-75 text-gray-800 font-semibold py-3 px-4 rounded shadow mb-4 ${submitted ? "hidden" : "block"} mx-auto`}
                disabled={ submitted }
              >
                Join the Discord
                <img src="/discord-logo.svg" className="inline-block ml-2" style={{height: "2rem"}}/>
              </button>
              <button type="button" className={`bg-gray-500 font-semibold text-gray-800 py-3 px-4 rounded shadow mb-4 ${submitted ? "block" : "hidden"} mx-auto`} disabled>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-200 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
							  Loading	
							</button> 
            </div>
          </div>
        </div>
      </form>
    </Fade>
  );
}
