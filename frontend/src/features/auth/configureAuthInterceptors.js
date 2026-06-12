import { refreshSession, sessionCleared } from './authSlice';
import { setAuthIntegration } from '../../lib/apiClient';

export function configureAuthInterceptors(store) {
  setAuthIntegration({
    getAccessToken: () => store.getState().auth.accessToken,

    refreshAccessToken: async () => {
      const result = await store.dispatch(refreshSession());

      if (refreshSession.fulfilled.match(result)) {
        return result.payload.accessToken;
      }

      store.dispatch(sessionCleared());
      return null;
    },

    onUnauthorized: () => {
      store.dispatch(sessionCleared());
    },
  });
}