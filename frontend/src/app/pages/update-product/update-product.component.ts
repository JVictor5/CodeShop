import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { CalendarModule } from 'primeng/calendar';
import { gameGenres } from '../../data/game-genres';
import { playerModes } from '../../data/player-modes';
import { DialogModule } from 'primeng/dialog';
import { FastAverageColor } from 'fast-average-color';

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
    CalendarModule,
    DialogModule,
    RouterModule,
  ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
  providers: [MessageService],
})
export class UpdateProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private imgService = inject(ImgService);
  private builder = inject(NonNullableFormBuilder);
  private messageService = inject(MessageService);
  productId: string = '';
  shopId: string = '';

  // variáveis que buscam os dados para popular o multi-select
  genres = gameGenres;
  playerModes = playerModes;

  // variável que recebe url após a inserção no supabase
  capaUrl: { sm: string; lg: string } = { sm: '', lg: '' };
  capaDestaqueUrl: { sm: string; lg: string } = { sm: '', lg: '' };

  selectedCapa: File[] = [];
  selectedCapaDestaque: File[] = [];
  currentCapa: string = '';
  currentCapaDestaque: string = '';
  showCapaInput: boolean = false;
  showCapaDestaqueInput: boolean = false;

  // variáveis de manipulação do dropzone
  unchangedImages: { sm: string[]; lg: string[] } = { sm: [], lg: [] };
  newImages: any[] = [];
  deletedImages: string[] = [];
  uploadedImages: any[] = [];
  beforeUpdateImages: string[] = [];
  pendingImages: any[] = [];

  selectedVideos: File[] = [];
  currentVideos: string[] = [];

  // controle dos códigos inseridos
  keys: string[] = [];
  editedIndex: number | null = null;
  quantity: number = 0;

  // variáveis de controle dos diferentes forms correspondentes a cada passo do stepper
  step1FormGroup!: FormGroup;
  step2FormGroup!: FormGroup;
  step3FormGroup!: FormGroup;
  step4FormGroup!: FormGroup;

  showGameGenres = false;
  activeIndex: number = 0;
  showSpinner: boolean = false;
  visibleModalWelcome: boolean = true;

  // variáveis para personalizar o card final do produto
  backgroundColorCardAnimation!: string;
  colorCardAnimation!: string;


  ngOnInit(): void {
    this.step1FormGroup = this.form.get('step1') as FormGroup;
    this.step2FormGroup = this.form.get('step2') as FormGroup;
    this.step3FormGroup = this.form.get('step3') as FormGroup;
    this.step4FormGroup = this.form.get('step4') as FormGroup;

    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id') ?? '';
    });
    const product = this.loadProduct();
    this.getProductMedia();
    product.then((p) => {
      this.form.patchValue({
        step1: {
          category: p.category,
        },
        step2: {
          name: p.name,
          description: p.description,
          price: p.price,
          storeForActivation: p.storeForActivation,
          releaseDate: p.releaseDate.bruteFormat,
        },
        step3: {
          titleDestaque: p.titleDestaque,
          descriptionDestaque: p.descriptionDestaque,
        },
      });
      this.showGameGenres = p.category === 'Jogos';
      if (this.showGameGenres) {
        this.form.patchValue({
          step2: {
            genres: p.genres,
            playerModes: p.playerModes,
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
      }
      this.currentCapa = p.capaUrl.sm;
      this.currentCapaDestaque = p.capaDestaqueUrl.sm;
      this.capaUrl = { sm: p.capaUrl.sm, lg: p.capaUrl.lg };
      this.capaDestaqueUrl = {
        sm: p.capaDestaqueUrl.sm,
        lg: p.capaDestaqueUrl.lg,
      };
      this.keys = p.keys;
      this.quantity = this.keys.length;
      this.beforeUpdateImages = p.imgUrls.sm;
      this.shopId = p.idUser;
    });
  }

  loadProduct() {
    const product = this.productService.getById(this.productId);
    return product;
  }

  async getProductMedia() {
    const productMedia = await this.imgService.getProductMedia(
      this.productId,
      'images',
      'sm'
    );
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
      storeForActivation: ['', Validators.required],
      releaseDate: ['', Validators.required],
      genres: [[] as string[], Validators.required],
      playerModes: [[] as string[], Validators.required],
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
      capaUrl: ['', Validators.required],
      videosUrls: [[] as string[], Validators.required],
      imgUrls: [[] as string[], Validators.required],
      titleDestaque: ['', Validators.required],
      capaDestaqueUrl: ['', Validators.required],
      descriptionDestaque: ['', Validators.required],
    }),
    step4: this.builder.group({
      keysInput: ['', Validators.required],
    }),
  });

  /**
   * Função destinada a mostrar os pop-ups.
   * @param severity gravidade da mensagem que implica no tema do pop-up
   * @param summary Título
   * @param detail Descrição
   */
  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
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
      } else if (!this.fValue.step2.storeForActivation) {
        this.showToast(
          'error',
          'Atenção',
          'Preencha o campo loja para ativação!'
        );
      } else if (!this.fValue.step2.releaseDate) {
        this.showToast('error', 'Atenção', 'Escolha uma data de lançamento!');
      } else if (this.showGameGenres && this.fValue.step2.genres.length == 0) {
        this.showToast('error', 'Atenção', 'Escolha gêneros para o jogo!');
      } else if (
        this.showGameGenres &&
        this.fValue.step2.playerModes.length == 0
      ) {
        this.showToast(
          'error',
          'Atenção',
          'Escolha modos de jogadores para o jogo!'
        );
      } else if (
        this.showGameGenres &&
        (!this.fValue.step2.minimumCpu ||
          !this.fValue.step2.minimumGpu ||
          !this.fValue.step2.minimumMemory ||
          !this.fValue.step2.minimumOs ||
          !this.fValue.step2.minimumStorage ||
          !this.fValue.step2.recommendedCpu ||
          !this.fValue.step2.recommendedGpu ||
          !this.fValue.step2.recommendedMemory ||
          !this.fValue.step2.recommendedStorage ||
          !this.fValue.step2.recommendedOs)
      ) {
        this.showToast(
          'error',
          'Atenção',
          'Preencha os requisitos de sistema!'
        );
      } else {
        this.activeIndex++;
      }
    } else if (index == 2) {
      if (this.uploadedImages.length == 0) {
        if (this.pendingImages.length > 0) {
          this.showToast('error', 'Atenção', 'Faça o upload das imagens!');
        } else {
          this.showToast('error', 'Atenção', 'Escolha as imagens!');
        }
      } else {
        this.activeIndex++;
      }
    } else if (index == 3) {
      if (this.keys.length == 0) {
        this.showToast('error', 'Atenção', 'Cadastre chave para o produto!');
      } else {
        this.showSpinner = true;
        if (await this.handleSubmit()) {
          this.applyColorToDiv();
          setTimeout(() => {
            this.activeIndex++;
            setTimeout(() => {
              this.showToast(
                'success',
                'Conclusão',
                'Chegamos ao fim! Obrigado por confiar na CodeShop.'
              );
            }, 400);
          }, 1000);
        }
      }
    }
  }

  validateImage(fileType: string): boolean {
    if (
      fileType == 'image/png' ||
      fileType == 'image/jpg' ||
      fileType == 'image/jpeg' ||
      fileType == 'image/webp'
    ) {
      return true;
    } else {
      return false;
    }
  }

  onCapaChange(event: any) {
    if (event.target.files.length > 0) {
      let fileType = event.target.files[0].type;
      if (this.validateImage(fileType)) {
        this.selectedCapa = Array.from(event.target.files);
      } else {
        this.form.get('step3.capaUrl')?.reset();
        this.selectedCapa = [];
        this.showToast('error', 'Atenção', 'Somente imagens são aceitas!');
      }
    }
  }
  onCapaDestaqueChange(event: any) {
    if (event.target.files.length > 0) {
      let fileType = event.target.files[0].type;
      if (this.validateImage(fileType)) {
        this.selectedCapaDestaque = Array.from(event.target.files);
      } else {
        this.form.get('step3.capaDestaqueUrl')?.reset();
        this.selectedCapaDestaque = [];
        this.showToast('error', 'Atenção', 'Somente imagens são aceitas!');
      }
    }
  }

  // Função para detectar mudança de categoria e mostrar o select de gêneros de jogos
  onProductCategoryChange(category: string): void {
    this.showGameGenres = category === 'Jogos';
  }

  // Função para aplicar a cor ao card final do produto
  applyColorToDiv(): void {
    const fac = new FastAverageColor();
    fac
      .getColorAsync(this.capaUrl.sm)
      .then((color) => {
        this.backgroundColorCardAnimation = color.rgba;
        this.colorCardAnimation = color.isDark ? '#fff' : '#000';
      })
      .catch((e) => {
        console.log(e);
      });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
    });
  }

  onVisibleModalWelcome() {
    this.visibleModalWelcome = false;
  }

  showCapaInputClick(): void {
    this.showCapaInput = true;
  }

  showCapaDestaqueClick(): void {
    this.showCapaDestaqueInput = true;
  }

  removeImageFromCurrentImages(index: number) {
    this.beforeUpdateImages.splice(index, 1);
  }

  // Função para adicionar as chaves do produto
  addKeys(): void {
    const keysInput: string | undefined =
      this.form.get('step4.keysInput')?.value;
    if (keysInput) {
      const newKeys = keysInput
        .split(/[\s,]+/)
        .filter((key) => key.trim() !== '');

      if (this.editedIndex !== null) {
        this.keys[this.editedIndex] = newKeys[0];
        this.editedIndex = null;
      } else {
        this.keys.push(...newKeys);
        this.quantity = this.keys.length;
      }

      this.form.get('step4.keysInput')?.reset();
    }
  }

  editKey(index: number): void {
    this.form.get('step4.keysInput')?.setValue(this.keys[index]);
    this.editedIndex = index;
  }

  removeKey(index: number): void {
    this.keys.splice(index, 1);
  }

  formatDate(inputString: any): string {
    let formattedDate = '';
    if (inputString instanceof Date) {
      formattedDate = this.setFormattedDate(inputString);
    }
    return formattedDate;
  }

  setFormattedDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses são indexados em 0
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  }

  // -- Início - Funções para o dropzone e a manipulação de imagens
  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedImages.push(file);
    }

    this.pendingImages = [];
    this.showToast('success', 'Sucesso', 'Upload feito.');
  }

  onSelectedFiles(event: any) {
    this.pendingImages.push(...event.files);
    this.showToast(
      'info',
      'Escolha feita',
      'Não se esqueça de fazer o upload.'
    );
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
  onRemoveTemplatingFile(
    event: Event,
    file: any,
    removeFileCallback: Function,
    index: number
  ) {
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
  // -- Fim - Funções para o dropzone e a manipulação de imagens

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

  formatNameSearch(name: string): string {
    // Mapeamento dos números para sua versão escrita
    const numberMap: { [key: string]: string } = {
      '0': 'zero',
      '1': 'um',
      '2': 'dois',
      '3': 'três',
      '4': 'quatro',
      '5': 'cinco',
      '6': 'seis',
      '7': 'sete',
      '8': 'oito',
      '9': 'nove',
    };

    // Substituir números por sua versão escrita
    let formattedName = name.replace(/[0-9]/g, (num) => numberMap[num]);

    // Substituir caracteres acentuados pela versão sem acento e transformar em minúsculo
    formattedName = formattedName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Remover espaços em branco e caracteres especiais
    formattedName = formattedName.replace(/[\s\W_]+/g, '');

    return formattedName;
  }

  async handleSubmit() {
    try {
      const nameSearch = this.formatNameSearch(this.fValue.step2.name);
      let formValue;
      if (this.showGameGenres) {
        formValue = {
          id: this.productId,
          category: this.fValue.step1.category,
          name: this.fValue.step2.name,
          nameSearch: nameSearch,
          description: this.fValue.step2.description,
          price: this.fValue.step2.price,
          storeForActivation: this.fValue.step2.storeForActivation,
          keys: this.keys,
          quantity: this.quantity,
          playerModes: Array.isArray(this.fValue.step2.playerModes)
            ? this.fValue.step2.playerModes
            : [this.fValue.step2.playerModes],
          genres: Array.isArray(this.fValue.step2.genres)
            ? this.fValue.step2.genres
            : [this.fValue.step2.genres],
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
          },
          releaseDate: {
            dateFormat: this.formatDate(this.fValue.step2.releaseDate),
            bruteFormat: this.fValue.step2.releaseDate,
          },
          titleDestaque: this.fValue.step3.titleDestaque,
          descriptionDestaque: this.fValue.step3.descriptionDestaque,
        };
      } else {
        formValue = {
          id: this.productId,
          category: this.fValue.step1.category,
          name: this.fValue.step2.name,
          nameSearch: nameSearch,
          description: this.fValue.step2.description,
          price: this.fValue.step2.price,
          storeForActivation: this.fValue.step2.storeForActivation,
          genres: this.fValue.step2.genres,
          keys: this.keys,
          quantity: this.quantity,
          releaseDate: {
            dateFormat: this.formatDate(this.fValue.step2.releaseDate),
            bruteFormat: this.fValue.step2.releaseDate,
          },
          titleDestaque: this.fValue.step3.titleDestaque,
          descriptionDestaque: this.fValue.step3.descriptionDestaque,
        };
      }
      await this.productService.update(formValue);
      const id = this.productId;

      if (this.selectedCapa.length > 0) {
        const message = await this.imgService.deleteProductMedia(
          id,
          'capa',
          this.currentCapa
        );
        if (message == 'Success') {
          const capaUrlArray = await this.imgService.uploadProductMedia(
            id,
            'capa',
            this.selectedCapa
          );
          this.capaUrl = {
            sm: capaUrlArray.sm[0],
            lg: capaUrlArray.lg[0],
          };
          await this.productService.update({
            id,
            capaUrl: this.capaUrl,
          });
        }
      }

      if (this.selectedCapaDestaque.length > 0) {
        const message = await this.imgService.deleteProductMedia(
          id,
          'capa-destaque',
          this.currentCapaDestaque
        );
        if (message == 'Success') {
          const capaDestaqueUrlArray = await this.imgService.uploadProductMedia(
            id,
            'capa-destaque',
            this.selectedCapaDestaque
          );
          this.capaDestaqueUrl = {
            sm: capaDestaqueUrlArray.sm[0],
            lg: capaDestaqueUrlArray.lg[0],
          };
          await this.productService.update({
            id,
            capaDestaqueUrl: this.capaDestaqueUrl,
          });
        }
      }

      this.checkUpdateImg();
      // lógica para remover as imagens apagadas no supabase e persistir no firebase somente as inalteradas
      if (this.deletedImages.length > 0) {
        this.deletedImages.forEach(async (img) => {
          const message = await this.imgService.deleteProductMedia(
            id,
            'images',
            img
          );
          if (message != 'Success') {
            console.error('Erro ao apagar imagem:', img);
          }
        });
        const unchangedImages = {
          sm: this.unchangedImages.sm,
          lg: this.unchangedImages.lg,
        };
        await this.productService.update({
          id,
          imgUrls: unchangedImages,
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
          lg: [...this.unchangedImages.lg, ...newImgs.lg],
        };
        await this.productService.update({
          id,
          imgUrls,
        });
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
