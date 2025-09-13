import { getDBInstance } from '@/database/core/web-server';
import { oidcEnv } from '@/envs/oidc';
import { OIDCProvider, createOIDCProvider } from '@/libs/oidc-provider/provider';

/**
 * OIDC Provider 实例
 */
let provider: OIDCProvider;

/**
 * 获取 OIDC Provider 实例
 * @returns OIDC Provider 实例
 */
export const getOIDCProvider = async (): Promise<OIDCProvider> => {
  if (!provider) {
    if (!oidcEnv.ENABLE_OIDC) {
      throw new Error('OIDC is not enabled. Set ENABLE_OIDC=1 to enable it.');
    }

    // Check if APP_URL is available before creating the provider
    const { appEnv } = await import('@/envs/app');
    if (!appEnv.APP_URL) {
      throw new Error(
        'APP_URL is required for OIDC Provider. Please set APP_URL environment variable.',
      );
    }

    const db = getDBInstance();
    provider = await createOIDCProvider(db);
  }

  return provider;
};
