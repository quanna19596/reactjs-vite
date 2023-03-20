const env = {
  siteName: import.meta.env.VITE_SITE_NAME ?? '',
  domainName: import.meta.env.VITE_DOMAIN_NAME ?? '',
  rootUrl: import.meta.env.VITE_ROOT_URL ?? '',
  api: {
    baseUrl: {
      aService: import.meta.env.VITE_SERVICE_A_BASE_URL ?? '',
      bService: import.meta.env.VITE_SERVICE_B_BASE_URL ?? ''
    }
  },
  cookie: {
    domain: import.meta.env.VITE_COOKIE_DOMAIN ?? ''
  }
};

export default env;
