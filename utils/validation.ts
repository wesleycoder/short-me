import validUrl from "valid-url";

export const validateUrl = (
  url: string = "",
  required: boolean = false
): boolean => Boolean(!required || url) && (!url || Boolean(validUrl.isWebUri(url)));
