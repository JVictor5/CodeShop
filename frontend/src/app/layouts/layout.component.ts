import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
  Event,
} from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { filter, Subscription } from 'rxjs';

import { LoadingComponent } from './loading/loading.component';
import { LoadingService } from '../core/services/loading.service';

@Component({
  standalone: true,
  selector: 'app-layouts',
  templateUrl: './layout.component.html',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, LoadingComponent],
})
export class LayoutComponent {
  hide = true;
  private routeSubscription!: Subscription;

  constructor(private router: Router, private loadingService: LoadingService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide(1000);
      }
    });
  }

  ngOnInit(): void {
    this.updateHideStatus();
    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHideStatus();
        window.scrollTo(0, 0);
      });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private updateHideStatus(): void {
    const currentUrl = this.router.url;
    const base64Prefix = '/trocar-senha?code=';
    this.hide =
      currentUrl.startsWith(base64Prefix) ||
      currentUrl === '/login' ||
      currentUrl === '/carrinho/pagamento/cartao' ||
      currentUrl === '/trocar-senha';
  }
}
