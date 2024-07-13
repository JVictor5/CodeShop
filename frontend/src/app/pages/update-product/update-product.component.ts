import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { UpdateProduct } from '../../core/interfaces/update-product-interface';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
 } from '@angular/forms';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit {
  form: FormGroup = this.builder.group({});
  productId: string = '';
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private builder: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.builder.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required]
    })
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') ?? '';
      this.loadProduct();
    })
  }

  loadProduct(): void {
    if (this.productId) {
      this.productService.getById(this.productId).then(product => {
        this.form.patchValue(product);
      })
    }
  }

  get f() {
    return this.form.controls;
  }

  get fValue() {
    return this.form.getRawValue();
  }

  async handleSubmit() {
    try {
      // id: this.productId,
      // const data: UpdateProduct = {
      //   name: this.fValue.name,
      //   description: this.fValue.description,
      //   price: parseFloat(this.fValue.price),
      //   quantity: parseInt(this.fValue.quantity)
      // };
      await this.productService.update(this.fValue);
    } catch (error) {
      console.log(error);
    }
  }
}
