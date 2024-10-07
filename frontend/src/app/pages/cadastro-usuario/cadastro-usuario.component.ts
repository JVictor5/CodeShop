import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Router, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Observable, OperatorFunction, distinctUntilChanged, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToastrService } from 'ngx-toastr';
import { ErrorToast } from '../../../assets/toast/erro.toast';
@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbModule,
    FloatLabelModule,
    InputTextModule,
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CadastroUsuarioComponent {
  isSignUpMode: boolean = false;
  showDomainSuggestions: boolean = false;
  loginError: boolean = false;
  emailError: boolean = false;
  emailSuggestions: string[] = ['gmail.com', 'outlook.com', 'yahoo.com'];
  filteredEmails: string[] = [];

  switchToSignUp() {
    this.isSignUpMode = true;
  }

  switchToSignIn() {
    this.isSignUpMode = false;
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      distinctUntilChanged(),
      map((term) => {
        if (!term || term.indexOf('@') >= 0 || term.length < 1) {
          return [];
        }
        return ['@gmail.com', '@hotmail.com', '@yahoo.com', '@outlook.com'].map(
          (domain) => `${term}${domain}`
        );
      })
    );

  private builder = inject(NonNullableFormBuilder);

  username: string = '';

  async ngOnInit() {}

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login = this.builder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  form = this.builder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.passwordValidator()]],
    document: ['', [Validators.required, this.validateDocument.bind(this)]],
    documentType: [''],
    phone: ['', [Validators.required, Validators.pattern(/\d{10,11}$/)]],
    nivel: [1, [Validators.required]],
  });

  validateDocument(control: any) {
    const value = control.value;

    if (!value) {
      return null;
    }
    if (value.length < 11) {
      return { invalidCpf: true };
    } else if (value.length < 14) {
      return { invalidCnpj: true };
    }

    return null; // Valid document
  }
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      // Check for minimum length, uppercase letter, and number
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const isValidLength = password.length >= 8;

      const valid = hasUpperCase && hasNumber && isValidLength;

      return !valid ? { passwordStrength: true } : null;
    };
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

  async handleSubmit() {
    this.setDocumentType();
    try {
      const response = await this.authService.cad(this.fValue);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  onSubmit() {
    if (this.login.valid) {
      const { email, password } = this.login.value;
      this.authService
        .signIn(email!, password!)
        .then((success) => {
          if (success) {
            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
          } else {
            this.loginError = true;
          }
        })
        .catch(() => {
          this.loginError = true;
        });
    } else {
      this.login.markAllAsTouched();
    }
  }
  showError() {
    this.toastr.error(
      'Email não informado. Por favor, preencha o campo.',
      'Error',
      {
        closeButton: true,
      }
    );
  }

  showSuccess() {
    this.toastr.success('Email enviado com sucesso!', 'Success', {
      closeButton: true,
    });
  }
  recoverPassword() {
    if (this.login.value.email) {
      this.authService.recoverPass(this.login.value.email);
      this.showSuccess();
      this.emailError = false;
    } else {
      this.showError();
      this.emailError = true;
    }
  }
}
