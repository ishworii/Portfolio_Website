import { useEffect, useState } from "react";

// Cycles through `words`, typing and deleting each one.
export function useTypewriter(words, { typeMs = 70, deleteMs = 40, holdMs = 1600 } = {}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    let delay;

    if (!deleting && text === word) {
      delay = holdMs;
    } else if (deleting && text === "") {
      delay = 300;
    } else {
      delay = deleting ? deleteMs : typeMs;
    }

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, wordIndex, words, typeMs, deleteMs, holdMs]);

  return text;
}
