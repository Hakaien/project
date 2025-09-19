import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  it('should be defined as an array', () => {
    expect(Array.isArray(appRoutes)).toBeTrue();
  });

  it('should contain a default redirect to /dashboard', () => {
    const defaultRoute = appRoutes.find(r => r.path === '');
    expect(defaultRoute).toBeDefined();
    expect(defaultRoute && defaultRoute.redirectTo).toBe('/dashboard');
    expect(defaultRoute && defaultRoute.pathMatch).toBe('full');
  });

  it('should contain a catch-all (** ) redirect to /dashboard', () => {
    const wildcard = appRoutes.find(r => r.path === '**');
    expect(wildcard).toBeDefined();
    expect(wildcard && wildcard.redirectTo).toBe('/dashboard');
  });

  it('should contain login and dashboard routes', () => {
    const login = appRoutes.find(r => r.path === 'login');
    const dashboard = appRoutes.find(r => r.path === 'dashboard');
    expect(login).toBeDefined();
    expect(dashboard).toBeDefined();
  });
});
