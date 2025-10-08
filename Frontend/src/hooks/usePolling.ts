import { useEffect } from "react";

export const usePolling = (callback, delay, shouldRun = true) => {
  useEffect(() => {
    if (!shouldRun) return;
    callback(); // initial call
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay, shouldRun]);
};
