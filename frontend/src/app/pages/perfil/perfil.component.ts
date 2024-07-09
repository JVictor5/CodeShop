import { Component, inject } from '@angular/core';
import { ImgService } from '../../core/services/img.service';
import { AuthService } from '../../core/services/auth.service';
import { UserRepository } from '../../core/repositories/user.repository';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { CadastroUsuarioComponent } from '../cadastro-usuario/cadastro-usuario.component';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

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
  ],
})
export class PerfilComponent {
  selectedFile: File | null = null;
  username: string = '';
  documentType: string = '';
  document: string = '';
  email: string = '';
  phone: string = '';
  avatar: string = '';
  id: string = '';

  private userRepository = inject(UserRepository);
  private builder = inject(NonNullableFormBuilder);

  constructor(
    private imgService: ImgService,
    private authService: AuthService
  ) {}

  exibirConteudo = true; // Opção padrão inicialmente visível
  opcaoSelecionada: string | null = null;

  mostrarConteudo() {
    this.exibirConteudo = true;
    this.opcaoSelecionada = null; // Limpa a seleção de outras opções
  }

  exibirOpcao(opcao: string) {
    this.exibirConteudo = false; // Esconde o conteúdo principal
    this.opcaoSelecionada = opcao; // Define a opção selecionada
  }

  form = this.builder.group({
    name: ['', []],
    email: ['', [Validators.email]],
    password: ['', []],
    document: ['', []],
    documentType: ['', []],
    phone: ['', []],
    nivel: [1, []],
  });

  async ngOnInit() {
    this.authService.currentUser.subscribe(async (user) => {
      if (!user) {
        this.username = 'Usuário';
        this.avatar = 'assets/avatar/avatarPadrao.jpg';
      }
      this.id = user.uid;
      this.avatar = `http://127.0.0.1:5001/teste-4c267/southamerica-east1/api/users/${this.id}/avatar`;
      const userFromApi = await this.userRepository.getById(`${this.id}`);
      this.username = userFromApi.name;
      this.document = userFromApi.document;
      this.email = userFromApi.email;
      this.documentType = userFromApi.documentType;
      this.phone = userFromApi.phone;

      this.form.patchValue({
        name: userFromApi.name,
        email: userFromApi.email,
        document: userFromApi.document,
        phone: userFromApi.phone,
      });
    });
  }

  setDocumentType() {
    const documentValue = this.form.get('document')?.value;
    const documentLength = documentValue?.toString().length;

    if (documentLength === 11) {
      this.form.get('documentType')?.setValue('CPF');
    } else if (documentLength === 14) {
      this.form.get('documentType')?.setValue('CNPJ');
    } else {
      this.form.get('documentType')?.setValue('');
    }
  }

  get f() {
    return this.form.controls;
  }
  get fValue() {
    return this.form.getRawValue();
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async update() {
    this.setDocumentType();
    try {
      const response = await this.authService.update(this.fValue, this.id);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    console.log(this.fValue);
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

  async submit() {
    this.update();
    this.uploadFile();
  }

  // Para enviar varios de uma vez só Usar em produtos!

  // selectedFiles: File[] = [];
  // idproduct = 'hBXmnjCK74MOIIXlEmwn';
  // onFileSelected(event: any): void {
  //   this.selectedFiles = event.target.files;
  // }

  // uploadImages(event: Event): void {
  //   event.preventDefault();
  //   console.log('Arquivos selecionados:', this.selectedFiles);
  // }

  // async uploadFile() {
  //   if (this.selectedFiles) {
  //     try {
  //       await this.imgService.uploadProductMedia(
  //         this.idproduct,
  //         this.selectedFiles
  //       );
  //       console.log('Upload successful');
  //     } catch (error) {
  //       console.error('Erro ao fazer o upload:', error);
  //     }
  //   }
  // }
}
