import React, { createContext, useContext, useState, useCallback } from "react";

const LoginModalContext = createContext();

export const useLoginModal = () => useContext(LoginModalContext);

export const LoginModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState(0); // 0 = password, 1 = OTP

  const openLoginModal = useCallback((tab = 1) => {
    setDefaultTab(tab);
    setOpen(true);
  }, []);
  const closeLoginModal = useCallback(() => setOpen(false), []);

  return (
    <LoginModalContext.Provider
      value={{ openLoginModal, closeLoginModal, open, defaultTab, setOpen }}
    >
      {children}
    </LoginModalContext.Provider>
  );
};
