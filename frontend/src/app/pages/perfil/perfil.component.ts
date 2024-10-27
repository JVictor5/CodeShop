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
  ],
})
export class PerfilComponent {
  selectedFile: File | null = null;
  username: string = '';
  id: string = '';
  nivel: number = 1;
  avatar: string = '';

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
        this.avatar = `http://127.0.0.1:5001/teste-4c267/southamerica-east1/api/users/${this.id}/avatar`;
        const userFromApi = await this.userRepository.getById(`${this.id}`);
        this.username = userFromApi.name;
        this.nivel = userFromApi.nivel;
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
        await this.imgService.uploadFile(this.selectedFile);
        console.log('Upload successful');
      } catch (error) {
        console.error('Erro ao fazer o upload:', error);
      }
    }
  }
}
