import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Observable, OperatorFunction, distinctUntilChanged, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbModule,
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class CadastroUsuarioComponent {
  isSignUpMode: boolean = false;
  showDomainSuggestions: boolean = false;

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
    documentType: [''],
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

  recoverPassword() {
    console.log(this.login.value.email);
    if (this.login.value.email) {
      this.authService.recoverPass(this.login.value.email);
    } else {
      console.error('O email não foi fornecido.');
    }
  }
}
