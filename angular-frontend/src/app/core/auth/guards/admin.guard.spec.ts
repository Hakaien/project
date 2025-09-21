import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'hasRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AdminGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated and has admin role', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasRole.and.returnValue(true);

    expect(guard.canActivate()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    expect(guard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to dashboard when user is not an admin', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasRole.and.returnValue(false);

    expect(guard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});