const env = {
  siteName: import.meta.env.VITE_SITE_NAME ?? '',
  domainName: import.meta.env.VITE_DOMAIN_NAME ?? '',
  rootUrl: import.meta.env.VITE_ROOT_URL ?? '',
  api: {
    baseUrl: {
      petStoreService: import.meta.env.VITE_PETSTORE_SERVICE ?? ''
    }
  },
  cookie: {
    domain: import.meta.env.VITE_COOKIE_DOMAIN ?? ''
  }
};

export default env;
