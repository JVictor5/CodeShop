import { CommonModule, NgIf, Location } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BadgeModule } from 'primeng/badge';
import { UserRepository } from '../../core/repositories/user.repository';
import { gameGenres } from '../../data/game-genres';
import { CartService } from '../../core/services/shoppingCart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgIf, BadgeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isHovered: boolean = false;
  isInputFocused: boolean = false;
  genres = gameGenres;
  [x: string]: any;
  isExpanded = false;
  isHovering = false;
  totalCart: number = 0;

  private userRepository = inject(UserRepository);
  private location: Location = inject(Location);
  private router = inject(Router);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isHovering) {
      this.isExpanded = false;
    }
  }

  showMenuPerfil: boolean = false;
  isLoggedIn: boolean = false;

  username: string = '';
  id: string = '';
  avatar: string | null = '';
  email: string = '';
  idShop: string = '';

  nivel = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    this.cartService.totalQuantity$.subscribe((total) => {
      this.totalCart = total;
    });
    console.log(this.totalCart);
    this.authService.currentUser.subscribe(async (user) => {
      if (!user) {
        this.isLoggedIn = false;
        this.username = 'Visitante';
        this.avatar = 'assets/avatar/avatarPadrao.jpg';
      } else {
        this.isLoggedIn = true;
        this.username = user.displayName;
        this.id = user.uid;
        this.email = user.email;
        const userFromApi = await this.userRepository.getById(`${this.id}`);
        this.nivel = userFromApi.nivel;
        this.idShop = userFromApi.idShop || '';
        if (!userFromApi.avatar) {
          this.avatar = 'assets/avatar/avatarPadrao.jpg';
        } else {
          this.avatar = userFromApi.avatar;
        }
      }
    });
  }

  toggleMenuPerfil() {
    this.showMenuPerfil = !this.showMenuPerfil;
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

  async searchProduct(inputValue: string) {
    if (inputValue.trim()) {
      this.location.go('/produtos/nome/' + this.formatNameSearch(inputValue));
    }
  }

  formatNameSearch(name: string): string {
    // Mapeamento dos números para sua versão escrita
    const numberMap: { [key: string]: string } = {
      "0": "zero",
      "1": "um",
      "2": "dois",
      "3": "três",
      "4": "quatro",
      "5": "cinco",
      "6": "seis",
      "7": "sete",
      "8": "oito",
      "9": "nove",
    };

    // Substituir números por sua versão escrita
    let formattedName = name.replace(/[0-9]/g, (num) => numberMap[num]);

    // Substituir caracteres acentuados pela versão sem acento e transformar em minúsculo
    formattedName = formattedName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Remover espaços em branco e caracteres especiais
    formattedName = formattedName.replace(/[\s\W_]+/g, "");

    return formattedName;
  }

  @ViewChild('inputSearch') inputSearch!: ElementRef<HTMLInputElement>;
  searchVisible = false;
  menuVisible = false;

  showSearchInput() {
    this.searchVisible = true;
  }

  toggleSearchInput() {
    this.searchVisible = true;
    setTimeout(() => this.inputSearch.nativeElement.focus(), 0);
  }

  hideSearchInput() {
    this.searchVisible = false;
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
}
