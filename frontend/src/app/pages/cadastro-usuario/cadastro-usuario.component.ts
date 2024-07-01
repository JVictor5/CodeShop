import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { RouterOutlet, Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss',
})
export class CadastroUsuarioComponent {
  [x: string]: any;
  isSignUpMode: boolean = false;

  switchToSignUp() {
    this.isSignUpMode = true;
  }

  switchToSignIn() {
    this.isSignUpMode = false;
  }

  private builder = inject(NonNullableFormBuilder);

  username: string = '';

  async ngOnInit() {}

  constructor(private authService: AuthService, private router: Router) {}

  login = this.builder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  form = this.builder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    document: ['', [Validators.required]],
    documentType: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    nivel: [1, [Validators.required]],
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
        .then(() => {
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error('Erro ao fazer login:', error);
        });
    }
  }

  recover() {
    console.log(this.login.value.email);
    if (this.login.value.email) {
      this.authService.recoverPass(this.login.value.email);
    } else {
      console.error('O email não foi fornecido.');
    }
  }
  recoverPassword() {
    if (this.login.value.email) {
      this.authService.recoverPassword(this.login.value.email);
      console.log(this.login.value.email);
    } else {
      console.error('O email não foi fornecido.');
    }
  }
}
