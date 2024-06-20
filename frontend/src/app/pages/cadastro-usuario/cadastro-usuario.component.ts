import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, HttpClientModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss',
})
export class CadastroUsuarioComponent {
  private http = inject(HttpClient);
  private builder = inject(NonNullableFormBuilder);

  username: string = '';

  async ngOnInit() {}

  constructor(private authService: AuthService) {}

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
    avatar: ['assets/avatar/avatarPadrao.jpg', [Validators.required]],
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
    console.log(this.fValue);
  }

  onSubmit() {
    if (this.login.valid) {
      const { email, password } = this.login.value;
      this.authService.signIn(email!, password!);
    }
  }
}
