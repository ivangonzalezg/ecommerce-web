import { useContext, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { StatusContext } from "../contexts/status";

export default function Toast() {
  const { addToast } = useToasts();
  const {
    errorMessage,
    successMessage,
    infoMessage,
    warningMessage,
    updateErrorMessage,
    updateSuccessMessage,
    updateInfoMessage,
    updateWarningMessage
  } = useContext(StatusContext);

  useEffect(() => {
    if (errorMessage) {
      addToast(errorMessage, {
        appearance: "error"
      });
      updateErrorMessage("");
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      addToast(successMessage, {
        appearance: "success"
      });
      updateSuccessMessage("");
    }
  }, [successMessage]);

  useEffect(() => {
    if (infoMessage) {
      addToast(infoMessage, {
        appearance: "info"
      });
      updateInfoMessage("");
    }
  }, [infoMessage]);

  useEffect(() => {
    if (warningMessage) {
      addToast(warningMessage, {
        appearance: "warning"
      });
      updateWarningMessage("");
    }
  }, [warningMessage]);

  return null;
}
