import { useState, useEffect } from 'react';

export const useHostURL = (defaultHost: string = "https://short.me") => {
  const [host, setHost] = useState(defaultHost);

  useEffect(() => {
    setHost(window?.location?.href || defaultHost);
  }, [defaultHost]);

  return host;
};
