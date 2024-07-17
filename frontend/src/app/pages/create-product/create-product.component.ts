import { Component, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateProduct } from '../../core/interfaces/create-product-interface';
import { ImgService } from '../../core/services/img.service';
import { UpdateProduct } from '../../core/interfaces/update-product-interface';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent {
  private productService = inject(ProductService);
  private imgService = inject(ImgService);
  private builder = inject(NonNullableFormBuilder);
  selectedCapa: File[] = [];
  selectedImages: File[] = [];
  selectedVideos: File[] = [];

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
  onVideosChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedVideos = Array.from(event.target.files);
    }
  }

  form = this.builder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0.0, Validators.required],
    quantity: [0, Validators.required],
    capaUrl: [[], Validators.required],
    videosUrls: [[], Validators.required],
    imgUrls: [[], Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  get fValue() {
    return this.form.getRawValue();
  }

  async handleSubmit() {
    try {
      const id: string = await this.productService.create(this.fValue);
      const capaUrl = await this.imgService.uploadProductMedia(
        id,
        this.selectedCapa
      );
      const imgUrls = await this.imgService.uploadProductMedia(
        id,
        this.selectedImages
      );
      const videosUrls = await this.imgService.uploadProductMedia(
        id,
        this.selectedVideos
      );
      await this.productService.update({
        id,
        capaUrl: capaUrl[0],
        imgUrls,
        videosUrls,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
