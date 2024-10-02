import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../core/services/auth.service';
import { ShopService } from '../../core/services/shop.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SellerComponent {
  constructor(
    private shopService: ShopService,
    private authService: AuthService
  ) {}
  id = '';

  private builder = inject(NonNullableFormBuilder);

  form = this.builder.group({
    idUser: ['', [Validators.required]],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    discription: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/\d{10,11}$/)]],
  });

  get f() {
    return this.form.controls;
  }
  get fValue() {
    return this.form.getRawValue();
  }

  async ngOnInit() {
    this.authService.currentUser.subscribe(async (user) => {
      this.id = user.uid;
      this.form.patchValue({
        idUser: user.uid,
      });
    });
  }
  async handleSubmit() {
    const phoneValue = this.form.get('phone')?.value;
    if (phoneValue && !phoneValue.startsWith('+55')) {
      this.form
        .get('phone')
        ?.setValue(`+55${phoneValue}`, { emitEvent: false });
    }
    if (this.form.valid) {
      const response = await this.shopService.cad(this.fValue);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
