import "fomantic-ui-css/semantic.min.css";

import { useEffect } from "react";
import { useMiddlecatContext } from "../../amcat4react";
import { LoadingIndicator } from "./LoadingIndicator";
import Speeches from "./Speeches";

function ParLawSpeech() {
  useEffect(() => {
    document.title = "ParlSpeechTracker";
  }, []);
  const { user, signInGuest } = useMiddlecatContext();

  useEffect(() => {
    if (user) return;
    const hostEnv = process.env.NEXT_PUBLIC_AMCAT_HOST;
    signInGuest?.(hostEnv || "http://localhost/amcat", "", false);
  }, [user]);

  return (
    <>
      <LoadingIndicator />
      <Speeches />
    </>
  );
}

export default ParLawSpeech;
