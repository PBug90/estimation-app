import React, { useState } from "react";
import { Redirect, useLocation, useHistory } from "react-router";
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
  return (
    <>
      <input
        className="border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        onClick={() => {
          console.log(username);
          sessionStorage.setItem("username", username);
          history.replace(from);
        }}
      >
        Confirm
      </button>
    </>
  );
}
