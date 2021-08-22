import React, { useState } from "react";
import { useLocation, useHistory } from "react-router";
import { nanoid } from "nanoid";
interface LocationState {
  from: {
    pathname: string;
  };
}

export default function Login() {
  const location = useLocation<LocationState>();
  const [username, setUsername] = useState<string>("");
  const history = useHistory();
  let { from } = location.state || { from: { pathname: "/" } };
  let buttonText = "Continue and create a new room";
  if (from.pathname !== "/") {
    buttonText = "Continue";
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Pick your username!
            </h2>
          </div>
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Your username
                </label>
                <input
                  id="email-address"
                  name="text"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <button
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  sessionStorage.setItem("username", username);
                  if (from.pathname === "/") {
                    const id = nanoid(8);
                    history.replace({
                      pathname: `/room/${id}`,
                    });
                  } else {
                    history.replace(from);
                  }
                }}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
