import "fomantic-ui-css/semantic.min.css";

import useMiddlecat from "middlecat-react";
import { useEffect } from "react";
import { useMiddlecatContext } from "../../amcat4react";
import { LoadingIndicator } from "./LoadingIndicator";
import Speeches from "./Speeches";

function ParLawSpeech() {
  useEffect(() => {
    document.title = "ParlSpeechTracker";
  }, []);
  const { user } = useMiddlecatContext();
  const { signInGuest } = useMiddlecat();

  useEffect(() => {
    if (user) return;
    const hostEnv = process.env.NEXT_PUBLIC_AMCAT_HOST;
    signInGuest("http://localhost/amcat", "ParLawSpeech", true);
  }, [user]);

  return (
    <>
      <LoadingIndicator />
      <Speeches />
    </>
  );
}

export default ParLawSpeech;
