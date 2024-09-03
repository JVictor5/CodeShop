import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateProduct } from '../../core/interfaces/create-product-interface';
import { ImgService } from '../../core/services/img.service';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepperModule,
    ButtonModule,
    ListboxModule,
    FileUploadModule,
    ToastModule,
    BadgeModule,
    ProgressBarModule,
    MultiSelectModule,
    FormsModule,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
  providers: [MessageService]
})
export class CreateProductComponent {
  private productService = inject(ProductService);
  private imgService = inject(ImgService);
  private builder = inject(NonNullableFormBuilder);
  private messageService = inject(MessageService);

  idProduct: string = '';
  capaUrl: string[] = [];

  selectedCapa: File[] = [];
  selectedImages: File[] = [];
  pendingImages: File[] = [];
  selectedVideos: File[] = [];
  keys: string[] = [];
  quantity: number = 0;

  step1FormGroup!: FormGroup;
  step2FormGroup!: FormGroup;
  step3FormGroup!: FormGroup;

  showGameGenres = false;
  activeIndex: number = 0;

  genres = [
    { name: 'Ação', code: 'acao' },
    { name: 'Aventura', code: 'aventura' },
    { name: 'Casual', code: 'casual' },
    { name: 'Co-op (Cooperativo)', code: 'coop' },
    { name: 'Esporte', code: 'esporte' },
    { name: 'Estratégia', code: 'estrategia' },
    { name: 'Horror psicológico', code: 'horror_psicologico' },
    { name: 'Indie', code: 'indie' },
    { name: 'Narrativa (Point & Click)', code: 'narrativa' },
    { name: 'Plataforma 2D', code: 'plataforma_2d' },
    { name: 'Plataforma 3D', code: 'plataforma_3d' },
    { name: 'PvE (Jogador contra Ambiente)', code: 'pve' },
    { name: 'PvP (Jogador contra Jogador)', code: 'pvp' },
    { name: 'Quebra-cabeças (Puzzle)', code: 'quebra_cabecas' },
    { name: 'Roguelike', code: 'roguelike' },
    { name: 'Roguelite', code: 'roguelite' },
    { name: 'Sandbox', code: 'sandbox' },
    { name: 'Simulação', code: 'simulacao' },
    { name: 'Tiro em primeira pessoa (FPS)', code: 'fps' }
  ];

  ngOnInit() {
    this.step1FormGroup = this.form.get('step1') as FormGroup;
    this.step2FormGroup = this.form.get('step2') as FormGroup;
    this.step3FormGroup = this.form.get('step3') as FormGroup;
    this.form.get('step2.genres')?.setValue([]);
  }

  /**
   * Função destinada a mostrar os pop-ups.
   * @param severity gravidade da mensagem que implica no tema do pop-up
   * @param summary Título
   * @param detail Descrição
   */
  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  /**
   * Função destinada a fazer o incremento da paginação do stepper.
   * @param index Índice atual do stepper
   */
  async onNextStep(index: number) {
    if (index == 0) {
      if (!this.fValue.step1.category) {
        this.showToast('error', 'Atenção', 'Escolha uma categoria!');
      } else {
        this.activeIndex++;
      }
    } else if (index == 1) {
      if (!this.fValue.step2.name) {
        this.showToast('error', 'Atenção', 'Preencha o campo nome!');
      } else if (!this.fValue.step2.description) {
        this.showToast('error', 'Atenção', 'Preencha o campo descrição!');
      } else if (!this.fValue.step2.price) {
        this.showToast('error', 'Atenção', 'Preencha o campo preço!');
      } else if (this.selectedCapa.length == 0) {
        this.showToast('error', 'Atenção', 'Escolha uma capa!');
      } else if (this.selectedImages.length == 0) {
        if (this.pendingImages.length > 0) {
          this.showToast('error', 'Atenção', 'Faça o upload das imagens!');
        } else {
          this.showToast('error', 'Atenção', 'Escolha as imagens!');
        }
      } else if (this.showGameGenres && this.fValue.step2.genres.length == 0) {
        this.showToast('error', 'Atenção', 'Escolha gêneros para o jogo!');
      } else {
        this.activeIndex++;
      }
    } else if (index == 2) {
      if (this.keys.length == 0) {
        this.showToast('error', 'Atenção', 'Cadastre chave para o produto!');
      } else {
        if (await this.handleSubmit()) {
          this.activeIndex++;
        }
      }
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

  // Função para detectar mudança de categoria e mostrar o select de gêneros de jogos
  onProductCategoryChange(category: string): void {
    this.showGameGenres = (category === 'Jogos');
  }

  // Função para tratar o evento de upload bem-sucedido
  onTemplatedUpload(event: any) {
    this.selectedImages.push(...event.files);
    this.pendingImages = [];
    this.showToast('success', 'Sucesso', 'Upload feito.');
  }

  // Função para tratar a seleção de arquivos
  onSelectedFiles(event: any) {
    this.pendingImages.push(...event.files);
    this.showToast('info', 'Escolha feita', 'Não se esqueça de fazer o upload.');
  }

  // Função para formatar o tamanho do arquivo
  formatSize(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Função para remover arquivo antes do upload
  onRemoveTemplatingFile(event: Event, file: any, removeFileCallback: Function, index: number) {
    removeFileCallback(index);
  }

  // Função para iniciar o processo de upload manualmente
  uploadEvent(uploadCallback: Function) {
    uploadCallback();
  }

  // Função para escolher arquivos manualmente
  choose(event: Event, chooseCallback: Function) {
    chooseCallback();
  }

  // Função para remover arquivos já carregados
  removeUploadedFile(removeUploadedFileCallback: Function, index: number) {
    removeUploadedFileCallback(index);
    this.selectedImages.splice(index, 1);
    this.showToast('success', 'Sucesso', 'Imagem removida.');
  }

  // Função para adicionar as chaves do produto
  addKeys(): void {
    const keysInput = this.form.get('step3.keysInput')?.value;
    if (keysInput) {
      const newKeys = keysInput.split(/[\s,]+/).filter(key => key.trim() !== '');
      this.keys.push(...newKeys);
      this.quantity = this.keys.length;
      this.form.get('step3.keysInput')?.reset();
    }
  }

  form = this.builder.group({
    step1: this.builder.group({
      category: ['', Validators.required],
    }),
    step2: this.builder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0.0, Validators.required],
      capaUrl: [[], Validators.required],
      videosUrls: [[], Validators.required],
      imgUrls: [[], Validators.required],
      genres: [[''], Validators.required]
    }),
    step3: this.builder.group({
      keysInput: ['', Validators.required],
    })
  });


  get f() {
    return this.form.controls;
  }

  get fValue() {
    return this.form.getRawValue();
  }

  async handleSubmit() {
    try {
      const formValue: CreateProduct = {
        category: this.fValue.step1.category,
        name: this.fValue.step2.name,
        description: this.fValue.step2.description,
        price: this.fValue.step2.price,
        genres: this.fValue.step2.genres,
        keys: this.keys,
        quantity: this.quantity,
        capaUrl: '',
        imgUrls: [''],
        videosUrls: ['']
      };

      const id: string = await this.productService.create(formValue);
      this.idProduct = id;
      this.capaUrl = await this.imgService.uploadProductMedia(
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
        capaUrl: this.capaUrl[0],
        imgUrls,
        videosUrls,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
