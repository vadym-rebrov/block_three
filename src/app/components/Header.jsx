import React, { useMemo, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Button from 'components/Button';
import Hover from 'components/Hover';
import IconButton from 'components/IconButton';
import IconGlobus from 'components/icons/Globus';
import Link from 'components/Link';
import Logo from 'components/Logo';
import Menu from 'components/Menu';
import MenuItem from 'components/MenuItem';
import Typography from 'components/Typography';
import useChangePage from 'misc/hooks/useChangePage';
import useCurrentPage from 'misc/hooks/useCurrentPage';
import useIsMobile from 'misc/hooks/useIsMobile';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import useTheme from 'misc/hooks/useTheme';

import * as pages from 'constants/pages';
import languages from 'misc/constants/languages';
import pagesURLs from 'constants/pagesURLs';

import LeftNavBar from './LeftNavBar';

const getClasses = createUseStyles((theme) => ({
  container: {
    color: theme.header.color.text.primary,
    background: theme.header.color.background,
    boxShadow: '0px 0px 6px 0px',
    display: 'flex',
    height: `${theme.header.height}px`,
    zIndex: 1300,
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    width: '100%',
  },
  hover: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
  },
  selectedLang: {
    display: 'flex',
    width: 'fit-content',
  },
  toolBarContainerLeft: {
    alignItems: 'center',
    display: 'flex',
    gap: `${theme.spacing(1)}px`,
  },
  toolBarContainerRight: {
    alignItems: 'center',
    display: 'flex',
    gap: `${theme.spacing(1)}px`,
    justifyContent: 'flex-end',
  },
  userNameMobile: {
    maxWidth: '110px',
  },
}));

const interfaceLagsTranslate = {
  [languages.en]: 'English',
  [languages.ua]: 'Українська',
};

const interfaceLagsTranslateShort = {
  [languages.en]: 'Eng',
  [languages.ua]: 'Укр',
};

const orderedInterfaceLangs = [
  languages.ua,
  languages.en,
];

const rightPanelItemTypes = {
  LANGUAGE: 'language',
  LOGIN: 'login',
  LOGOUT: 'logout', // Добавили новый тип
  SEPARATOR: 'separator',
  USER_NAME: 'userName',
};

function Header({
                  onLogout,
                }) {
  const { theme } = useTheme();
  const { formatMessage } = useIntl();
  const changePage = useChangePage();
  const classes = getClasses({ theme });
  const currentPage = useCurrentPage();
  const isMobile = useIsMobile();
  const langsMenuRef = useRef(null);
  const locationSearch = useLocationSearch();
  const user = useSelector(({ user: reducerUser }) => reducerUser);
  const userMenuRef = useRef(null);
  console.log(user);
  const [state, setState] = useState({
    isLangsMenuOpened: false,
    isUserMenuOpened: false,
  });

  const userName = user.fullName || user.login;

  const actualOrderedRightPanelItemTypes = useMemo(() => {
    const result = [];
    if (user.isAuthorized) {
      result.push(rightPanelItemTypes.USER_NAME);
      result.push(rightPanelItemTypes.LOGOUT);
    } else if (
        !user.isFetchingUser
        && currentPage !== pages.login
    ) {
      result.push(rightPanelItemTypes.LOGIN);
    }
    result.push(rightPanelItemTypes.LANGUAGE);

    return result.reduce((acc, item, index) => {
      if (index > 0) {
        acc.push(rightPanelItemTypes.SEPARATOR);
      }
      acc.push(item);
      return acc;
    }, []);
  }, [user, currentPage]);

  return (
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.toolBarContainerLeft}>
            <LeftNavBar />
            <Link
                to={{
                  pathname: `${pagesURLs[pages.defaultPage]}`,
                }}
            >
              <Hover
                  light
                  selected={currentPage === pages.defaultPage}
              >
                <div className={classes.hover}>
                  <Logo compact={isMobile} />
                </div>
              </Hover>
            </Link>
            {user.isAuthorized && (
                <Link to={{
                  pathname: `${pagesURLs[pages.movies]}`,
                }}>
                  <Typography variant="title" color={'#c500dd'}><b>Movies</b></Typography>
                </Link>
            )}
          </div>
          <div className={classes.toolBarContainerRight}>
            {actualOrderedRightPanelItemTypes.map((itemType) => (
                <React.Fragment key={itemType}>
                  {itemType === rightPanelItemTypes.USER_NAME && (
                      <div ref={userMenuRef}>
                        <Hover
                            light
                            onClick={() => setState({
                              ...state,
                              isUserMenuOpened: true,
                            })}
                            selected={state.isUserMenuOpened}
                        >
                          <div className={classes.hover}>
                            <div
                                className={isMobile ? classes.userNameMobile : ''}
                            >
                              <Typography
                                  color="paper"
                                  noWrap
                                  variant="subtitle"
                              >
                                {!isMobile
                                    ? (
                                        <strong>
                                          {userName}
                                        </strong>
                                    )
                                    : userName
                                }
                              </Typography>
                            </div>
                          </div>
                        </Hover>
                      </div>
                  )}
                  {itemType === rightPanelItemTypes.LOGIN && (
                      <Link
                          to={{
                            pathname: `${pagesURLs[pages.login]}`,
                          }}
                      >
                        <Button
                            colorVariant="header"
                            variant="text"
                        >
                          <Typography
                              color="inherit"
                              variant="subtitle"
                          >
                            <strong>
                              {formatMessage({ id: 'signIn' })}
                            </strong>
                          </Typography>
                        </Button>
                      </Link>
                  )}
                  {/* Рендер кнопки LOGOUT */}
                  {itemType === rightPanelItemTypes.LOGOUT && (
                      <Button
                          colorVariant="header"
                          variant="text"
                          onClick={onLogout}
                      >
                        <Typography
                            color="#f009"
                            variant="subtitle"
                        >
                          <strong>
                            {formatMessage({ id: 'signOut' })}
                          </strong>
                        </Typography>
                      </Button>
                  )}
                  {itemType === rightPanelItemTypes.LANGUAGE && (
                      <>
                        <div className={classes.selectedLang}>
                          <Typography
                              color="paper"
                              noWrap
                          >
                            {(isMobile
                                    ? interfaceLagsTranslateShort
                                    : interfaceLagsTranslate
                            )[locationSearch.lang]}
                          </Typography>
                        </div>
                        <div ref={langsMenuRef}>
                          <IconButton
                              colorVariant="header"
                              onClick={() => setState({
                                ...state,
                                isLangsMenuOpened: true,
                              })}
                          >
                            <IconGlobus
                                color="header"
                                size={32}
                            />
                          </IconButton>
                        </div>
                      </>
                  )}
                  {itemType === rightPanelItemTypes.SEPARATOR && (
                      <Typography
                          color="paper"
                          variant="subtitle"
                      >
                        <strong>
                          |
                        </strong>
                      </Typography>
                  )}
                </React.Fragment>
            ))}
          </div>

          {/* Меню языков */}
          <Menu
              anchorEl={langsMenuRef.current}
              colorVariant="header"
              open={state.isLangsMenuOpened}
              onClose={() => setState({
                ...state,
                isLangsMenuOpened: false,
              })}
          >
            {orderedInterfaceLangs.map(lang => (
                <MenuItem
                    key={lang}
                    onClick={() => {
                      changePage({
                        locationSearch: {
                          ...locationSearch,
                          lang,
                        },
                        replace: true,
                      });
                      setState({
                        ...state,
                        isLangsMenuOpened: false,
                      });
                    }}
                    selected={locationSearch.lang === lang}
                >
                  <Typography>
                    {interfaceLagsTranslate[lang]}
                  </Typography>
                </MenuItem>
            ))}
          </Menu>

          {/* Меню пользователя (можно убрать пункт выхода отсюда, если он дублируется, или оставить) */}
          <Menu
              anchorEl={userMenuRef.current}
              open={state.isUserMenuOpened}
              onClose={() => setState({
                ...state,
                isUserMenuOpened: false,
              })}
          >
            {/* Оставляем меню для будущих пунктов профиля, но пока оно может быть пустым или содержать Logout как дубль */}
            <MenuItem
                onClick={() => {
                  setState({
                    ...state,
                    isUserMenuOpened: false,
                  });
                  onLogout();
                }}
            >
              <Typography>
                {formatMessage({ id: 'signOut' })}
              </Typography>
            </MenuItem>
          </Menu>
        </div>
      </div>
  );
}

export default Header;