"use client";

import { useState, useEffect } from "react";
import { verifyPin, setAdminPin, clearAdminPin } from "./admin-api";

const ADMIN_KEY = "tamh-admin";

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem(ADMIN_KEY) === "true");
  }, []);

  const unlock = async (pin: string): Promise<boolean> => {
    const ok = await verifyPin(pin);
    if (ok) {
      setAdminPin(pin);
      sessionStorage.setItem(ADMIN_KEY, "true");
      setIsAdmin(true);
    }
    return ok;
  };

  const lock = () => {
    clearAdminPin();
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  };

  return { isAdmin, unlock, lock };
}
