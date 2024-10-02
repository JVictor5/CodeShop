import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { UserRepository } from '../../core/repositories/user.repository';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-dados',
  standalone: true,
  imports: [
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    DialogModule,
  ],
  templateUrl: './user-dados.component.html',
  styleUrl: './user-dados.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserDadosComponent {
  username: string = '';
  documentType: string = '';
  document: string = '';
  email: string = '';
  phone: string = '';
  avatar: string = '';
  id: string = '';
  nivel: number | undefined;
  isEditing = false;

  private userRepository = inject(UserRepository);
  private builder = inject(NonNullableFormBuilder);

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.authService.currentUser.subscribe(async (user) => {
      if (!user) {
        this.username = 'Usuário';
        this.avatar = 'assets/avatar/avatarPadrao.jpg';
        return;
      }
      this.id = user.uid;
      this.avatar = `http://127.0.0.1:5001/teste-4c267/southamerica-east1/api/users/${this.id}/avatar`;
      const userFromApi = await this.userRepository.getById(`${this.id}`);
      this.username = userFromApi.name;
      this.document = userFromApi.document;
      this.email = userFromApi.email;
      this.documentType = userFromApi.documentType;
      this.phone = userFromApi.phone;
      this.nivel = userFromApi.nivel;

      this.form.patchValue({
        name: userFromApi.name,
        email: userFromApi.email,
        password: userFromApi.password,
        document: userFromApi.document,
        phone: userFromApi.phone,
        nivel: userFromApi.nivel,
      });
    });
  }

  form = this.builder.group({
    name: ['', []],
    email: ['', [Validators.email]],
    password: ['', []],
    document: ['', []],
    documentType: [''],
    phone: ['', [Validators.pattern(/\d{10,11}$/)]],
    nivel: [1, []],
  });

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

  async update() {
    this.setDocumentType();
    const phoneValue = this.form.get('phone')?.value;
    if (phoneValue && !phoneValue.startsWith('+55')) {
      this.form
        .get('phone')
        ?.setValue(`+55${phoneValue}`, { emitEvent: false });
    }
    console.log(this.id);
    try {
      const response = await this.authService.update(this.fValue, this.id);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  onCloseModal() {
    this.isEditing = false;
    this.loadData();
  }
  openModal() {
    this.isEditing = true;
  }
}
