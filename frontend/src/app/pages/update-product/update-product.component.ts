import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  selector: 'app-update-product',
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
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
  providers: [MessageService]
})
export class UpdateProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private imgService = inject(ImgService);
  private builder = inject(NonNullableFormBuilder);
  private messageService = inject(MessageService);
  productId: string = '';

  capaUrl: { sm: string; lg: string; } = { sm: '', lg: '' };

  selectedCapa: File[] = [];
  currentCapa: string = '';
  showCapaInput: boolean = false;

  unchangedImages: { sm: string[]; lg: string[]; } = { sm: [], lg: [] };
  newImages: any[] = [];
  deletedImages: string[] = [];
  uploadedImages: any[] = [];
  beforeUpdateImages: string[] = [];
  pendingImages: any[] = [];
  showImagesInput: boolean = false;

  selectedVideos: File[] = [];
  currentVideos: string[] = [];

  keys: string[] = [];
  editedIndex: number | null = null;
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

  ngOnInit(): void {
    this.step1FormGroup = this.form.get('step1') as FormGroup;
    this.step2FormGroup = this.form.get('step2') as FormGroup;
    this.step3FormGroup = this.form.get('step3') as FormGroup;

    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') ?? '';
    });
    const product = this.loadProduct();
    this.getProductMedia();
    product.then(p => {
      this.form.patchValue({
        step1: {
          category: p.category,
        },
        step2: {
          name: p.name,
          description: p.description,
          price: p.price,
          genres: p.genres,
          minimumOs: p.minimumSystemRequirements?.os,
          minimumCpu: p.minimumSystemRequirements?.cpu,
          minimumStorage: p.minimumSystemRequirements?.storage,
          minimumMemory: p.minimumSystemRequirements?.memory,
          minimumGpu: p.minimumSystemRequirements?.gpu,
          recommendedOs: p.recommendedSystemRequirements?.os,
          recommendedCpu: p.recommendedSystemRequirements?.cpu,
          recommendedStorage: p.recommendedSystemRequirements?.storage,
          recommendedMemory: p.recommendedSystemRequirements?.memory,
          recommendedGpu: p.recommendedSystemRequirements?.gpu,
        },
      });
      this.showGameGenres = (p.category === 'Jogos');
      this.currentCapa = p.capaUrl.sm;
      this.capaUrl = { sm: p.capaUrl.sm, lg: p.capaUrl.lg };
      this.keys = p.keys;
      this.quantity = this.keys.length;
      this.beforeUpdateImages = p.imgUrls.sm;
    });
  }

  loadProduct() {
    const product = this.productService.getById(this.productId);
    return product;
  }

  async getProductMedia() {
    const productMedia = await this.imgService.getProductMedia(this.productId, 'images', 'sm');
    if (productMedia) {
      this.uploadedImages = productMedia;
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
      capaUrl: ['', Validators.required],
      videosUrls: [[] as string[], Validators.required],
      imgUrls: [[] as string[], Validators.required],
      genres: [[] as string[], Validators.required],
      minimumOs: '',
      minimumCpu: '',
      minimumStorage: '',
      minimumMemory: '',
      minimumGpu: '',
      recommendedOs: '',
      recommendedCpu: '',
      recommendedStorage: '',
      recommendedMemory: '',
      recommendedGpu: '',
    }),
    step3: this.builder.group({
      keysInput: ['', Validators.required],
    })
  });

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
      } else if (this.uploadedImages.length == 0) {
        if (this.pendingImages.length > 0) {
          this.showToast('error', 'Atenção', 'Faça o upload das imagens!');
        } else {
          this.showToast('error', 'Atenção', 'Escolha as imagens!');
        }
      } else if (this.showGameGenres && this.fValue.step2.genres.length == 0) {
        this.showToast('error', 'Atenção', 'Escolha gêneros para o jogo!');
      } else if (this.showGameGenres && (!this.fValue.step2.minimumCpu
        || !this.fValue.step2.minimumGpu
        || !this.fValue.step2.minimumMemory
        || !this.fValue.step2.minimumOs
        || !this.fValue.step2.minimumStorage
        || !this.fValue.step2.recommendedCpu
        || !this.fValue.step2.recommendedGpu
        || !this.fValue.step2.recommendedMemory
        || !this.fValue.step2.recommendedStorage
        || !this.fValue.step2.recommendedOs
      )) {
        this.showToast('error', 'Atenção', 'Preencha os requisitos de sistema!');
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
  /*onVideosChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedVideos = Array.from(event.target.files);
    }
  }*/

  // Função para detectar mudança de categoria e mostrar o select de gêneros de jogos
  onProductCategoryChange(category: string): void {
    this.showGameGenres = (category === 'Jogos');
  }

  showCapaInputClick(): void {
    this.showCapaInput = true;
  }

  showImagesInputClick(): void {
    this.showImagesInput = true;
  }

  removeImageFromCurrentImages(index: number) {
    this.beforeUpdateImages.splice(index, 1);
  }


  // Função para adicionar as chaves do produto
  addKeys(): void {
    const keysInput: string | undefined = this.form.get('step3.keysInput')?.value;
    if (keysInput) {
      const newKeys = keysInput.split(/[\s,]+/).filter(key => key.trim() !== '');

      if (this.editedIndex !== null) {
        this.keys[this.editedIndex] = newKeys[0];
        this.editedIndex = null;
      } else {
        this.keys.push(...newKeys);
        this.quantity = this.keys.length;
      }

      this.form.get('step3.keysInput')?.reset();
    }
  }

  editKey(index: number): void {
    this.form.get('step3.keysInput')?.setValue(this.keys[index]);
    this.editedIndex = index;
  }

  removeKey(index: number): void {
    this.keys.splice(index, 1);
  }

  get f() {
    return this.form.controls;
  }

  get fValue() {
    return this.form.getRawValue();
  }

  checkUpdateImg() {
    const currentImgUrls = this.uploadedImages.map((img) => img.objectURL);

    currentImgUrls.sort();
    this.beforeUpdateImages.sort();

    for (const img of this.beforeUpdateImages) {
      if (!currentImgUrls.includes(img)) {
        this.deletedImages.push(img);
      } else {
        // as imagens estão vindo com a url 'sm', então basta modificar somente para lg
        this.unchangedImages.sm.push(img);
        const partsImg = img.split('/');
        partsImg[partsImg.length - 2] = 'lg';
        const imgLg = partsImg.join('/');
        this.unchangedImages.lg.push(imgLg);
      }
    }

    for (const img of this.uploadedImages) {
      if (!this.beforeUpdateImages.includes(img.objectURL)) {
        this.newImages.push(img);
      }
    }
  }

  async handleSubmit() {
    try {
      let formValue;
      if (this.showGameGenres) {
        formValue = {
          id: this.productId,
          category: this.fValue.step1.category,
          name: this.fValue.step2.name,
          description: this.fValue.step2.description,
          price: this.fValue.step2.price,
          keys: this.keys,
          quantity: this.quantity,
          genres: Array.isArray(this.fValue.step2.genres) ? this.fValue.step2.genres : [this.fValue.step2.genres],
          minimumSystemRequirements: {
            os: this.fValue.step2.minimumOs,
            cpu: this.fValue.step2.minimumCpu,
            storage: this.fValue.step2.minimumStorage,
            memory: this.fValue.step2.minimumMemory,
            gpu: this.fValue.step2.minimumGpu,
          },
          recommendedSystemRequirements: {
            os: this.fValue.step2.recommendedOs,
            cpu: this.fValue.step2.recommendedCpu,
            storage: this.fValue.step2.recommendedStorage,
            memory: this.fValue.step2.recommendedMemory,
            gpu: this.fValue.step2.recommendedGpu,
          }
        };
      } else {
        formValue = {
          id: this.productId,
          category: this.fValue.step1.category,
          name: this.fValue.step2.name,
          description: this.fValue.step2.description,
          price: this.fValue.step2.price,
          genres: this.fValue.step2.genres,
          keys: this.keys,
          quantity: this.quantity,
        };
      }
      await this.productService.update(formValue);
      const id = this.productId;

      if (this.selectedCapa.length > 0) {
        const message = await this.imgService.deleteProductMedia(id, 'capa', this.currentCapa);
        if (message == 'Success') {
          const capaUrlArray = await this.imgService.uploadProductMedia(
            id,
            'capa',
            this.selectedCapa
          );
          this.capaUrl = {
            sm: capaUrlArray.sm[0],
            lg: capaUrlArray.lg[0]
          }
          await this.productService.update({
            id,
            capaUrl: this.capaUrl
          });
        }
      }

      this.checkUpdateImg();
      // lógica para remover as imagens apagadas no supabase e persistir no firebase somente as inalteradas
      if (this.deletedImages.length > 0) {
        this.deletedImages.forEach(async (img) => {
          const message = await this.imgService.deleteProductMedia(id, 'images', img);
          if (message != 'Success') {
            console.error('Erro ao apagar imagem:', img);
          }
        });
        const unchangedImages = {
          sm: this.unchangedImages.sm,
          lg: this.unchangedImages.lg
        }
        await this.productService.update({
          id,
          imgUrls: unchangedImages
        });
      }

      // lógica para inserir as imagens novas no supabase e no firebase
      if (this.newImages.length > 0) {
        const newImgs = await this.imgService.uploadProductMedia(
          this.productId,
          'images',
          this.newImages
        );
        const imgUrls = {
          sm: [...this.unchangedImages.sm, ...newImgs.sm],
          lg: [...this.unchangedImages.lg, ...newImgs.lg]
        };
        await this.productService.update({
          id,
          imgUrls
        });
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedImages.push(file);
    }

    this.pendingImages = [];
    this.showToast('success', 'Sucesso', 'Upload feito.');
  }

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
    this.pendingImages.splice(index, 1);
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
    this.uploadedImages.splice(index, 1);
    this.showToast('success', 'Sucesso', 'Imagem removida.');
  }
}
