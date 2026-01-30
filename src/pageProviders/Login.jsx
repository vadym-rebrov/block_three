import React, { useEffect } from 'react';
import useUser from 'misc/hooks/useUser';
import useChangePage from 'misc/hooks/useChangePage';
import LoginPage from 'pages/login';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';

const Login = () => {
  const { isLogined, isLoaded } = useUser();
  const changePage = useChangePage();
  console.log('IsLogined: ', isLogined);
  useEffect(() => {
    if (isLoaded && isLogined) {
      changePage({ path: pageURLs[pages.defaultPage] });
    }
  }, [isLoaded, isLogined, changePage]);

  if (isLogined) {
    return null;
  }

  // Показуємо форму входу ТІЛЬКИ якщо юзер НЕ залогінений
  // Ніякого PageAccessValidator тут не треба!
  return <LoginPage />;
};

export default Login;