import React, { createContext, useContext, useMemo } from 'react';

const IsAdminContext = createContext(false);

export const IsAdminProvider = ({ employees, children }) => {
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  const isAdmin = useMemo(() => {
    if (!employees || !Array.isArray(employees)) return false;
    const currentUserFromList = employees.find(e => e.userName === authUser.username);
    return currentUserFromList ? !!currentUserFromList.isAdmin : false;
  }, [employees, authUser.username]);

  return (
    <IsAdminContext.Provider value={isAdmin}>
      {children}
    </IsAdminContext.Provider>
  );
};

export const useIsAdmin = () => useContext(IsAdminContext);
