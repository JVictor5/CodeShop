import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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
        document: userFromApi.document,
        phone: userFromApi.phone,
        nivel: userFromApi.nivel,
      });
    });
  }

  form = this.builder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [this.passwordValidator()]],
    document: ['', [Validators.required, this.validateDocument.bind(this)]],
    documentType: [''],
    phone: ['', [Validators.required, Validators.pattern(/\d{10,11}$/)]],
    nivel: [1, []],
  });

  handlePhoneInput(event: Event) {
    const phoneField = event.target as HTMLInputElement;
    if (!phoneField.value.startsWith('+55')) {
      phoneField.value = '+55' + phoneField.value.slice(5);
    }
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const isValidLength = password.length >= 8;

      const valid = hasUpperCase && hasNumber && isValidLength;

      return !valid ? { passwordStrength: true } : null;
    };
  }

  validateDocument(control: any) {
    const value = control.value;

    if (!value) {
      return null;
    }
    if (value.length < 11) {
      return { invalidCpf: true };
    } else if (value.length > 11 && value.length < 14) {
      return { invalidCnpj: true };
    }

    return null;
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

  async update() {
    this.setDocumentType();
    console.log(this.id);
    try {
      const response = await this.authService.update(this.fValue, this.id);
      window.location.reload();
      if (this.fValue.password !== '' || this.fValue.email !== this.email) {
        window.location.href = '/';
      }
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
