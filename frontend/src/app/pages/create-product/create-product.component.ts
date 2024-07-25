import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import {
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateProduct } from '../../core/interfaces/create-product-interface';
import { ImgService } from '../../core/services/img.service';
import { UpdateProduct } from '../../core/interfaces/update-product-interface';
import { DropzoneModule, DropzoneConfigInterface, DropzoneComponent } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule, DropzoneModule],
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
  showGameGenres = false;

  genres = [
    'Ação', 'Aventura', 'Estratégia', 'Simulação', 'Indie', 'Esporte', 
    'Tiro em primeira pessoa (FPS)', 'Casual', 'Horror psicológico', 
    'Sandbox', 'Plataforma 2D', 'Plataforma 3D', 'Roguelike', 'Roguelite', 
    'Co-op (Cooperativo)', 'PvP (Jogador contra Jogador)', 'PvE (Jogador contra Ambiente)', 
    'Narrativa (Point & Click)', 'Quebra-cabeças (Puzzle)'
  ];

  @ViewChild(DropzoneComponent, { static: false }) dropzoneComponent?: DropzoneComponent;

  public config: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    maxFilesize: 10,
    maxFiles: 20,
    acceptedFiles: 'image/*',
    headers: {
      'My-Custom-Header': 'header value'
    },
    dictDefaultMessage:'Arraste e solte suas fotos ou clique para fazer upload.',
    dictFallbackMessage: 'Seu navegador não suporta arrastar e soltar arquivos.',
    dictInvalidFileType: 'Você não pode enviar arquivos deste tipo.',
    dictMaxFilesExceeded: 'Você não pode enviar mais arquivos.',
    dictCancelUploadConfirmation: 'Você tem certeza que deseja cancelar este upload?',
    addRemoveLinks: true,
    dictRemoveFile: 'Remover',
    dictCancelUpload: 'Cancelar',
  };

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

  onProductCategoryChange(category: string): void {
    this.showGameGenres = (category === 'Código de Jogos');
  }

  get genresArray(): FormArray {
    return this.form.get('genres') as FormArray;
  }

  ngAfterViewInit() {
    if (this.dropzoneComponent && this.dropzoneComponent.directiveRef) {
      const dropzone = this.dropzoneComponent.directiveRef.dropzone();

      dropzone.on('addedfile', (file: any) => {
        // console.log("Arquivo adicionado", file);
        dropzone.processQueue();
      });

      dropzone.on('uploadprogress', (file: any, progress: number) => {
        // console.log('Progresso do upload:', progress);
      });

      dropzone.on('success', (file: any, response: any) => {
        // console.log('Upload bem-sucedido:', response);
        this.selectedImages.push(file);
        // console.log("Arquivos após adicionar", this.selectedImages);
      });

      dropzone.on('error', (file: any, errorMessage: any) => {
        // console.error('Erro ao adicionar arquivo:', errorMessage);
      });

      dropzone.on('removedfile', (file: any) => {
        // console.log('Arquivo removido:', file);
        this.selectedImages = this.selectedImages.filter(f => f !== file);
        // console.log("Arquivos após remover:", this.selectedImages);
      });
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
    category: ['', Validators.required],
    genres: this.builder.array(this.genres.map(() => new FormControl('')))
  });

  get f() {
    return this.form.controls;
  }

  get fValue() {
    return this.form.getRawValue();
  }

  async handleSubmit() {
    try {
      const selectedGenres = this.genresArray.controls
      .map((control, i) => control.value ? this.genres[i] : null)
      .filter(value => value !== null);

      const formValue = {
        ...this.fValue,
        genres: selectedGenres
      };
      
      const id: string = await this.productService.create(formValue);
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
