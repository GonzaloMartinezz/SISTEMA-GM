import React, { createContext, useContext, useState } from 'react';

const ClientContext = createContext();

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const openClientProfile = (client) => {
    setSelectedClient(client);
    setIsProfileOpen(true);
  };

  const closeClientProfile = () => {
    setIsProfileOpen(false);
    // Optionally keep the selectedClient state for animation out
  };

  return (
    <ClientContext.Provider
      value={{
        selectedClient,
        isProfileOpen,
        openClientProfile,
        closeClientProfile,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
