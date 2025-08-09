import { useState, useCallback } from "react";

export const useTimedAlert = () => {
  const [alertState, setAlertState] = useState({
    visible: false,
    color: "",
    message: "",
  });

  const setAlert = useCallback((message, color = "info", timeoutMs = 3000) => {
    setAlertState({ visible: true, color, message });
    if (timeoutMs > 0) {
      setTimeout(
        () => setAlertState((prev) => ({ ...prev, visible: false })),
        timeoutMs
      );
    }
  }, []);

  return { alertState, setAlert, setAlertState };
};

export default useTimedAlert;
