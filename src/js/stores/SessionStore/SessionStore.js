import { types, flow, getParent } from 'mobx-state-tree';
import { reaction } from 'mobx';
import Cookies from 'universal-cookie';

import roles from '../../constants/roles';

const COOKIE_NAME = 'Authorization';

const SessionStore = types
  .model('SessionStore', {
    token: types.optional(types.string, ''),
    rememberMe: false,
  })
  .volatile(() => ({
    urlRoot: '/auth',
    cookies: new Cookies(),
  }))
  .views(self => ({
    get isLogged() {
      return self.token !== '' && self.token.length > 5;
    },

    get userFromTokenHeader() {
      const tokenContent = self.isLogged ? self.decodeJWTHeader(self.token) : null;
      return tokenContent ? tokenContent.user : null;
    },

    get transport() {
      return getParent(self).transport;
    },

    get currentUserRole() {
      return self.currentUser ? self.currentUser.role : roles.ROLE_GUEST;
    },
  }))
  .actions((self) => {
    /**
     * Decode JWT token header and return decoded content
     */
    const decodeJWTHeader = () => {
      const base64Url = self.token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64) || '{}');
    };

    /**
     * Do login with user credentials
     * If login succeed, save token from to use later in subsequent requests
     * @param {string} email
     * @param {string} password
     * @param {boolean} rememberMe
     * @param {function} onSuccess
     * @param {function} onError
     */
    const login = flow(function* login(
      email,
      password,
      rememberMe,
      onSuccess = () => {},
      onError = () => {},
    ) {
      self.rememberMe = rememberMe;
      try {
        const response = yield self.transport.post(`${self.urlRoot}/login`, {
          email,
          password,
        });
        const { token } = response.data;
        if (token && token.length) {
          self.token = token;
        }
        onSuccess(token);
      } catch (error) {
        console.error(error);
        onError(error);
      }
    });

    /**
     * Do logout, clear token from store and cookie
     */
    const logout = () => {
      self.token = '';
    };

    /**
     * Load authorization token from cookie
     */
    const loadAuthCookie = () => {
      self.token = self.cookies.get(COOKIE_NAME);
    };

    const forgotPassword = flow(function* forgotPassword(values) {
      try {
        const { data } = yield self.transport.post(`${self.urlRoot}/forgot-password`, values);
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    const newPassword = flow(function* newPassword(recoveryToken, password) {
      try {
        const { data } = yield self.transport.create(
          `${self.urlRoot}/new-password?token=${recoveryToken}`,
          { password },
        );
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    const checkRecoveryToken = flow(function* checkRecoveryToken(recoveryToken) {
      try {
        const { data } = yield self.transport.get(
          `${self.urlRoot}/forgot-token?token=${recoveryToken}`,
        );
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    const signUp = flow(function* signUp(values) {
      try {
        const { data } = yield self.transport.post(`${self.urlRoot}/signup`, values);
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    const setToken = (token) => {
      self.token = token;
    };

    /**
     * MobX State Tree model hook
     * This function will be called after this store is init
     * It will load and use token from cookie
     * This function will also observe token changed to set or remove cookie
     */
    const afterCreate = () => {
      self.loadAuthCookie();

      reaction(
        () => self.token,
        (token) => {
          if (!token) {
            // User logged out, remove cookie reload page
            self.cookies.remove(COOKIE_NAME, {
              path: '/',
            });

            window.location.reload();
          } else {
            self.cookies.set(
              COOKIE_NAME,
              token,
              self.rememberMe
                ? {
                    path: '/',
                    maxAge: 24 * 3600 * 30, // Expires cookies in 30 days
                  }
                : {
                    expires: 0,
                  },
            );
          }
        },
      );
    };

    return {
      afterCreate,
      checkRecoveryToken,
      decodeJWTHeader,
      forgotPassword,
      loadAuthCookie,
      login,
      logout,
      newPassword,
      setToken,
      signUp,
    };
  });

export default SessionStore;
