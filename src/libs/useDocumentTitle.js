import { useEffect, useRef } from "react";

export default function useDocumentTitle(title, restoreOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (restoreOnUnmount) {
        document.title = defaultTitle.current;
      }
    };
  }, [restoreOnUnmount]);
}
