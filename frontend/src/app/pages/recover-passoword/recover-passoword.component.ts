import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recover-passoword',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recover-passoword.component.html',
  styleUrl: './recover-passoword.component.scss',
})
export class RecoverPassowordComponent {
  private builder = inject(NonNullableFormBuilder);

  code = '';
  email = '';

  constructor(private auth: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.code = this.route.snapshot.queryParams['code'];
    this.email = atob(this.code);
  }

  form = this.builder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }
  get fValue() {
    return this.form.getRawValue();
  }

  async handleSubmit() {
    this.form.get('email')?.setValue(this.email);
    console.log(this.code);
    console.log(this.email);
    const response = await this.auth.newPass(this.fValue);
    console.log('response: ', response);
    console.log(this.fValue);
  }
}
