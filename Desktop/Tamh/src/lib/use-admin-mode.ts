"use client";

import { useState, useEffect } from "react";

const ADMIN_KEY = "tamh-admin";
const ADMIN_PIN = "0013";

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem(ADMIN_KEY) === "true");
  }, []);

  const unlock = (pin: string): boolean => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(ADMIN_KEY, "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const lock = () => {
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  };

  return { isAdmin, unlock, lock };
}
