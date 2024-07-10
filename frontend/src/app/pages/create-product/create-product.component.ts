import { Component, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateProduct } from '../../core/interfaces/create-product-interface';
import { ImgService } from '../../core/services/img.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent {
  private productService = inject(ProductService);
  private imgService = inject(ImgService);
  private builder = inject(NonNullableFormBuilder);
  selectedCapa: File[] = [];
  selectedImages: File[] = [];
  onImagesChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImages = Array.from(event.target.files);
    }
  }
  onCapaChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedCapa = Array.from(event.target.files);
    }
  }

  form = this.builder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    quantity: ['', Validators.required],
    capa: [[], Validators.required],
    images: [[], Validators.required]
  });

  get f() {
    return this.form.controls;
  }

  get fValue() {
    return this.form.getRawValue();
  }

  async handleSubmit() {
    try {
      const data: CreateProduct = {
        name: this.fValue.name,
        description: this.fValue.description,
        price: parseFloat(this.fValue.price),
        quantity: parseInt(this.fValue.quantity)
      };
      const id: string = await this.productService.create(data);
      const allImages = this.selectedCapa.concat(this.selectedImages);
      await this.imgService.uploadProductMedia(id, allImages);
    } catch (error) {
      console.log(error);
    }
  }
}
