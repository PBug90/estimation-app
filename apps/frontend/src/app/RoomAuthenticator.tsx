import React from 'react';
import { Navigate, useLocation } from 'react-router';
import Room from './Room';

export default function RoomAuthenticator() {
  const location = useLocation();
  const username = sessionStorage.getItem('username');

  if (username === null) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  return <Room username={username} />;
}
