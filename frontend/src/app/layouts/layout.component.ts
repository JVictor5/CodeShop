import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { filter, Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-layouts',
  templateUrl: './layout.component.html',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
})
export class LayoutComponent {
  hide = true;
  private routeSubscription!: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateHideStatus();
    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHideStatus();
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
