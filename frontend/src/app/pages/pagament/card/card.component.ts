import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from '../../../core/services/payment.service';
import { CartService } from '../../../core/services/shoppingCart.service';
import { AuthService } from '../../../core/services/auth.service';
import { KeyService } from '../../../core/services/key.service';
import { debounceTime } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  cardForm = inject(FormBuilder).group({
    cardName: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    cardMonth: ['', Validators.required],
    cardYear: ['', Validators.required],
    cardCvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  currentCardBackground = '';
  cardName = '';
  cardNumber = '';
  cardCvv = '';
  minCardYear = new Date().getFullYear();
  isCardFlipped = false;
  focusElementStyle: { border?: string } | null = null;
  isInputFocused = false;
  randomBackgrounds = true;
  backgroundImage: string | null = null;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  months = Array.from({ length: 12 }, (_, i) => i + 1);
  years = Array.from({ length: 12 }, (_, i) => this.minCardYear + i);
  cardYear = '';
  cardMonth = '';
  cardType = '';
  displayCardNumber = '**** **** **** ****';
  endCard = '';
  idBuy = '';

  constructor(
    private cartService: CartService,
    private pagamentoRepository: PaymentService,
    private authService: AuthService,
    private keyService: KeyService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.updateCardBackground();
    this.cardForm.valueChanges.pipe(debounceTime(30)).subscribe((values) => {
      this.cardName = values.cardName || '';
      this.cardNumber = values.cardNumber || '';
      this.cardMonth = values.cardMonth || '';
      this.cardYear = values.cardYear || '';
      this.cardCvv = values.cardCvv || '';
      this.updateCardType();
      this.updateCardNumberPattern();
      this.formatCardNumber();
    });
  }
  getFormattedCardName(): string[] {
    return this.cardName
      .split('')
      .map((char) => (char === ' ' ? '\u00A0' : char));
  }

  get minCardMonth(): number {
    return this.cardYear === this.currentYear.toString()
      ? this.currentMonth
      : 1;
  }

  updateCardType(): void {
    this.cardType = this.getCardType();
  }

  updateCardNumberPattern(): void {
    const patterns: { [key: string]: RegExp } = {
      visa: /^\d{16}$/,
      mastercard: /^\d{16}$/,
      amex: /^\d{15}$/,
    };
    const pattern = patterns[this.cardType] || /^\d{16}$/;
    this.cardForm.controls['cardNumber'].setValidators([
      Validators.required,
      Validators.pattern(pattern),
    ]);
    this.cardForm.controls['cardNumber'].updateValueAndValidity();
  }

  formatCardNumber(): void {
    if (this.cardNumber === '') {
      this.displayCardNumber = '**** **** **** ****';
      return;
    }

    const value = this.cardNumber.replace(/\D/g, '');
    const maskedValue = ['****', '****', '****', '****'];

    for (let i = 0; i < value.length; i++) {
      const groupIndex = Math.floor(i / 4);
      if (groupIndex < maskedValue.length) {
        maskedValue[groupIndex] =
          maskedValue[groupIndex].substring(0, i % 4) +
          value[i] +
          maskedValue[groupIndex].substring((i % 4) + 1);
      }
    }

    this.displayCardNumber = maskedValue.join(' ');
    this.cardNumber = value;
    this.endCard = value.slice(-4);
    this.updateCardType();
    this.updateCardNumberPattern();
  }

  getCardType(): string {
    const number = this.cardNumber.replace(/\D/g, '');
    const firstDigits = number.slice(0, 4);
    const cardPatterns = {
      amex: /^3[47]/,
      visa: /^4/,
      mastercard: /^5[1-5]/,
      discover: /^6(?:011|5)/,
    };
    for (const [type, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(firstDigits)) {
        return type;
      }
    }
    return '';
  }

  getCardTypeImageUrl(): string {
    const baseUrl =
      'https://raw.githubusercontent.com/Asrih7/ng-payment-card-form/main/projects/ng-payment-card-form/src/assets/images/';
    return this.cardType ? `${baseUrl}${this.cardType}.png` : '';
  }

  flipCard(isFlipped: boolean): void {
    this.isCardFlipped = isFlipped;
  }
  focusInput(): void {
    this.isInputFocused = true;
    this.updateFocusElementStyle();
  }

  blurInput(): void {
    this.isInputFocused = false;
    this.updateFocusElementStyle();
  }

  private updateFocusElementStyle(): void {
    this.focusElementStyle = this.isInputFocused
      ? { border: '2px solid blue' }
      : null;
  }

  updateCardBackground(): void {
    const baseUrl =
      'https://raw.githubusercontent.com/Asrih7/ng-payment-card-form/main/projects/ng-payment-card-form/src/assets/images/';
    if (this.randomBackgrounds && !this.backgroundImage) {
      const random = Math.floor(Math.random() * 25) + 1;
      this.currentCardBackground = `${baseUrl}${random}.jpeg`;
    } else if (this.backgroundImage) {
      this.currentCardBackground = this.backgroundImage;
    } else {
      this.currentCardBackground = '';
    }
  }

  submitForm(): void {
    Object.keys(this.cardForm.controls).forEach((control) => {
      this.cardForm.controls[
        control as keyof typeof this.cardForm.controls
      ].markAsTouched();
    });

    if (this.cardForm.valid) {
      this.cartService.cart$.subscribe(async (cartItems) => {
        if (cartItems.length > 0) {
          const paymentDetails = this.cartService.getPaymentDetails();
          const user = this.authService.getUser();
          const paymentData = {
            idUser: user.uid,
            precoTotal: paymentDetails.precoTotal,
            idProd: paymentDetails.products,
            endCard: this.endCard,
            status: 'Aprovado',
          };
          this.idBuy = await this.pagamentoRepository.create(paymentData);
          this.code();
          this.pagamentoRepository.toastSuccess();
          this.cartService.clearCart();
          this.router.navigate(['/']);
        }
      });
    } else {
      this.toastr.error(
        '',
        'Por favor, preencha todos os campos obrigatórios.',
        {
          closeButton: false,
        }
      );
    }
  }

  code(): void {
    const paymentDetails = this.cartService.getPaymentDetails();
    const user = this.authService.getUser();
    this.keyService.sendCode(user.uid, paymentDetails.products, this.idBuy);
  }
}
