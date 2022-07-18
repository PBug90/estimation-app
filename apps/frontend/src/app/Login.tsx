import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { nanoid } from 'nanoid';
import { UserRole } from '@estimation-app/types';
import { Button } from './Button';

export default function Login() {
  const location = useLocation();
  const [username, setUsername] = useState<string>('');
  const [userRole, setUserRole] = useState<string>(UserRole.DEVELOPER);
  const navigate = useNavigate();
  const { from } = location.state || { from: { pathname: '/' } };
  let buttonText = 'Continue and create a new room';
  let introText =
    'Create a new estimation room and start your planning poker session!';
  if (from.pathname !== '/') {
    buttonText = 'Continue';
    introText = 'You have been invited to a planning poker session!';
  }
  return (
    <div className="flex items-center justify-center text-white py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10">
        <div>
          <h1 className="text-white text-3xl font-extrabold text-center">
            EstimationApp
          </h1>
          <h2 className="mt-6 text-center text-xl font-extrabold">
            {introText}
          </h2>
        </div>
        <div className="mb-3 xl:w-96">
          <label
            htmlFor="username"
            className="form-label inline-block mb-2 text-gray-300"
          >
            Your username
          </label>
          <input
            type="text"
            className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
            id="username"
            minLength={3}
            maxLength={10}
            name="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="flexRadioDefault"
            className="form-label inline-block mb-2 text-gray-300"
          >
            Your role
          </label>
          <div className="form-check">
            <input
              className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              checked={userRole === UserRole.DEVELOPER}
              value={UserRole.DEVELOPER}
              onChange={(event) => setUserRole(event.target.value)}
            />
            <label
              className="form-check-label inline-block text-gray-300"
              htmlFor="flexRadioDefault1"
            >
              Developer
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              checked={userRole === UserRole.OBSERVER}
              value={UserRole.OBSERVER}
              onChange={(event) => setUserRole(event.target.value)}
            />
            <label
              className="form-check-label inline-block text-gray-300"
              htmlFor="flexRadioDefault2"
            >
              Observer
            </label>
          </div>
        </div>
        <div>
          <Button
            className="w-full"
            onClick={() => {
              sessionStorage.setItem('username', username);
              sessionStorage.setItem('role', userRole);
              if (from.pathname === '/') {
                const id = nanoid(8);
                navigate(`/room/${id}`);
              } else {
                navigate(from);
              }
            }}
            disabled={username.length < 3}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
