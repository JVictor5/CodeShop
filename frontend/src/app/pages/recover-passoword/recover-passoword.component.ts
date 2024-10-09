import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-recover-passoword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './recover-passoword.component.html',
  styleUrl: './recover-passoword.component.scss',
})
export class RecoverPassowordComponent {
  private builder = inject(NonNullableFormBuilder);

  code = '';
  email = '';
  isExpired = false;
  confirmPasswordTouched = false;
  displayModal: boolean = false;

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(private auth: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.code = this.route.snapshot.queryParams['code'];
    this.email = atob(this.code);
  }

  form = this.builder.group(
    {
      email: ['', []],
      password: ['', [Validators.required, this.passwordValidator()]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatch.bind(this) }
  );

  get f() {
    return this.form.controls;
  }
  get fValue() {
    return this.form.getRawValue();
  }

  passwordsMatch(group: any) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notMatching: true };
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

  checkIfLinkExpired(): boolean {
    const timestamp = parseInt(this.route.snapshot.queryParams['time'], 10);
    const currentTime = Date.now();
    const timeLimit = 60 * 60 * 1000;

    return currentTime - timestamp > timeLimit;
  }
  async handleSubmit() {
    this.isExpired = this.checkIfLinkExpired();
    if (!this.isExpired) {
      this.form.get('email')?.setValue(this.email);
      if (this.form.valid) {
        await this.auth.newPass({
          email: this.fValue.email,
          password: this.fValue.password,
        });
        window.close();
      }
    } else {
      this.showModal();
    }
  }

  showModal() {
    this.displayModal = true;
  }

  closeModal() {
    window.close();
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
