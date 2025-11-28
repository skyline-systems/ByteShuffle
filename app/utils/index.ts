/**
 * Removes http(s):// and optional www. and everything after the
 * optional trailing slash at the end of the url
 */
export const preserveDomainAndTLD = (url: string) => {
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/, "").replace(/\/.*$/, "");
};
