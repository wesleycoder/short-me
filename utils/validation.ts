import isUrl from "is-url";
import isDomainValid from "is-domain-valid";

export const validateUrl = (
  url: string = "",
  required: boolean = false
): boolean => {
  const valid = isDomainValid(url).result || isUrl(url);

  return required ? valid : !url || valid;
};
