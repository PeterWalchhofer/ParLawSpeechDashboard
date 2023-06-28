import _ from "lodash";
import { useCallback, useMemo } from "react";
import WordCloud from "react-d3-cloud";
import { Word } from "react-d3-cloud/lib/WordCloud";
import { randomIntFromInterval, sd } from "../modules/constants";

export default function SpeechWordCloud({
  chosenSpeech,
}: {
  chosenSpeech: any;
}) {
  // WordCloud lib expects frequencies instead of tf-idf values. Scale to 0-1000:
  const max_tfidf = useMemo(() => {
    if (!chosenSpeech?.term_tfidf?.length) return null;
    return Math.max(...chosenSpeech.term_tfidf.map((item: any) => item.value));
  }, [chosenSpeech?.term_tfidf]);

  const factor = 1000 / (max_tfidf || 1);

  const dataMemo: { text: string; value: number }[] = useMemo(
    () =>
      chosenSpeech?.term_tfidf.slice(0, 20).map((item: any) => ({
        text: item.term.toUpperCase(),
        value: item.value * factor,
      })) || [],
    [chosenSpeech.term_tfidf]
  );
  const rotateFn = useCallback(() => randomIntFromInterval(-45, 45), []);
  const fontWeightFn = useCallback(
    (word: Word) =>
      word.value /
      sd(chosenSpeech.term_tfidf.map((item: any) => item.value * 5000)),
    [chosenSpeech.term_tfidf]
  );

  return (
    <div className="wordCloud">
      <WordCloud
        width={300}
        height={450}
        rotate={rotateFn}
        data={dataMemo}
        // fontWeight={fontWeightFn}
      />
    </div>
  );
}
