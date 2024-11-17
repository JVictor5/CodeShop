import { Component, inject } from '@angular/core';
import { ImgService } from '../../core/services/img.service';
import { AuthService } from '../../core/services/auth.service';
import { UserRepository } from '../../core/repositories/user.repository';
import { ReactiveFormsModule } from '@angular/forms';
import { CadastroUsuarioComponent } from '../cadastro-usuario/cadastro-usuario.component';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { SellerComponent } from '../seller/seller.component';
import { UserDadosComponent } from '../user-dados/user-dados.component';
import { LibraryKeyComponent } from '../library-key/library-key.component';
import { PurchaseHistoryComponent } from '../purchase-history/purchase-history.component';
import { WishListComponent } from '../wish-list/wish-list.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  imports: [
    ReactiveFormsModule,
    CadastroUsuarioComponent,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SellerComponent,
    UserDadosComponent,
    LibraryKeyComponent,
    PurchaseHistoryComponent,
    WishListComponent,
  ],
})
export class PerfilComponent {
  selectedFile: File | null = null;
  username: string = '';
  id: string = '';
  nivel: number = 1;
  avatar: string | null = '';

  logado: boolean = false;
  exibirConteudo = true;
  opcaoSelecionada: string | null = null;

  private userRepository = inject(UserRepository);

  constructor(
    private imgService: ImgService,
    private authService: AuthService
  ) {}

  mostrarConteudo() {
    this.exibirConteudo = true;
    this.opcaoSelecionada = null;
  }

  exibirOpcao(opcao: string) {
    this.exibirConteudo = false;
    this.opcaoSelecionada = opcao;
  }

  async ngOnInit() {
    this.authService.currentUser.subscribe(async (user) => {
      if (user) {
        this.id = user.uid;
        const userFromApi = await this.userRepository.getById(`${this.id}`);
        this.username = userFromApi.name;
        this.nivel = userFromApi.nivel;
        this.avatar = userFromApi.avatar;
        this.logado = true;
      } else if (!user) {
        this.username = 'Usuário';
        this.avatar = 'assets/avatar/avatarPadrao.jpg';
        this.logado = false;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadFile() {
    if (this.selectedFile) {
      try {
        const avatarUrl = await this.imgService.uploadUserMedia(
          'avatar',
          this.selectedFile
        );
        if (avatarUrl) {
          const id = this.id;
          await this.userRepository.update({
            id,
            avatar: avatarUrl,
          });
        }
        await this.imgService.uploadSellerMedia(
          'neMRTYfisxEcVS9SIbmf',
          'avatar',
          this.selectedFile
        );
        window.location.reload();
      } catch (error) {
        console.error('Erro ao fazer o upload:', error);
      }
    }
  }
}
