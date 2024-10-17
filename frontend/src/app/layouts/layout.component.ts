import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-layouts',
  templateUrl: './layout.component.html',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
})
export class LayoutComponent {
  hide = this.isLoginRoute();

  constructor(private router: Router, private route: ActivatedRoute) {}

  isLoginRoute(): boolean {
    const currentUrl = this.router.url;
    const base64Prefix = '/trocar-senha?code=';

    if (currentUrl.startsWith(base64Prefix)) {
      return true;
    }
    return currentUrl === '/login';
  }
}
