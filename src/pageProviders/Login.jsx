import React, { useEffect } from 'react';
import useUser from 'misc/hooks/useUser';
import useChangePage from 'misc/hooks/useChangePage';

import LoginPage from 'pages/login';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages'
const Login = () => {
  const { isLogined, isLoaded } = useUser();
  const changePage = useChangePage();

  useEffect(() => {
    if (isLoaded && isLogined) {
      changePage({ path: `/${pageURLs[pages.defaultPage]}` });
    }
  }, [isLoaded, isLogined, changePage]);

  if (isLogined) {
    return null;
  }

  return (<LoginPage />);
};

export default Login;