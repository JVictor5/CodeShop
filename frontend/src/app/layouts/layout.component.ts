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
  constructor(private router: Router) {}

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
}
