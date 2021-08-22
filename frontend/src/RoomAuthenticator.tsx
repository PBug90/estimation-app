import React from "react";
import { Redirect, useLocation } from "react-router";
import Room from "./Room";

export default function RoomAuthenticator() {
  const location = useLocation();
  const username = sessionStorage.getItem("username");

  if (username === null) {
    return (
      <Redirect
        to={{
          pathname: "/",
          state: { from: location },
        }}
      />
    );
  }
  return <Room username={username} />;
}
