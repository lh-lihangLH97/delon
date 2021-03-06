import { Inject, Injectable, Injector } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad } from '@angular/router';
import { DelonAuthConfig } from '../../auth.config';
import { CheckSimple, ToLogin } from '../helper';
import { DA_SERVICE_TOKEN, ITokenService } from '../interface';

@Injectable({ providedIn: 'root' })
export class SimpleGuard implements CanActivate, CanActivateChild, CanLoad {
  private cog: DelonAuthConfig;

  constructor(
    @Inject(DA_SERVICE_TOKEN) private srv: ITokenService,
    private injector: Injector,
    cog: DelonAuthConfig,
  ) {
    this.cog = Object.assign(new DelonAuthConfig(), cog);
  }

  private process(): boolean {
    const res = CheckSimple(this.srv.get());
    if (!res) {
      ToLogin(this.cog, this.injector);
    }
    return res;
  }

  // lazy loading
  canLoad(): boolean {
    return this.process();
  }
  // all children route
  canActivateChild(): boolean {
    return this.process();
  }
  // route
  canActivate(): boolean {
    return this.process();
  }
}
