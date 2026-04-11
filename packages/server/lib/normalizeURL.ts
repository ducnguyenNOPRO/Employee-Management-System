export const getFrontendBaseUrl = () => {
  let url = process.env.CLIENT_URL;

  if (!url) {
    throw new Error("FRONTEND_URL is not defined");
  }

  // Uncomment when deployed
  // Also change the env to use https
  // if (!/^https?:\/\//i.test(url)) {
  //     url = `https://${url}`;
  // }

  // remove trailing slash
  url = url.replace(/\/+$/, "");

  return url;
};
