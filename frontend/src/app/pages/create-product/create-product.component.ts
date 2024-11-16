import { Component, inject, ElementRef, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { UserRepository } from '../../core/repositories/user.repository';
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
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { gameGenres } from '../../data/game-genres';
import { playerModes } from '../../data/player-modes';
import { FastAverageColor } from 'fast-average-color';
import { RouterModule } from '@angular/router';

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
    TooltipModule,
    CalendarModule,
    DialogModule,
    RouterModule
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
  providers: [MessageService, PrimeNGConfig]
})
export class CreateProductComponent {
  @ViewChild('cardAnimationRef', { static: false }) cardAnimationRef!: ElementRef;

  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private userRepository = inject(UserRepository);
  private imgService = inject(ImgService);
  private builder = inject(NonNullableFormBuilder);
  private messageService = inject(MessageService);
  private primengConfig = inject(PrimeNGConfig);

  // variáveis que buscam os dados para popular o multi-select
  genres = gameGenres;
  playerModes = playerModes;

  idProduct: string = '';
  idUser: string = '';
  userInfo: any;

  // variáveis que recebem url após a inserção no supabase
  capaUrl: { sm: string, lg: string } = { sm: '', lg: '' };
  capaDestaqueUrl: { sm: string, lg: string } = { sm: '', lg: '' };

  // variáveis de manipulação do dropzone
  selectedCapa: File[] = [];
  selectedCapaDestaque: File[] = [];
  selectedImages: File[] = [];
  pendingImages: File[] = [];
  selectedVideos: File[] = [];

  // controle dos códigos inseridos
  keys: string[] = [];
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

  ngOnInit() {
    this.step1FormGroup = this.form.get('step1') as FormGroup;
    this.step2FormGroup = this.form.get('step2') as FormGroup;
    this.step3FormGroup = this.form.get('step3') as FormGroup;
    this.step4FormGroup = this.form.get('step4') as FormGroup;

    this.authService.currentUser.subscribe(async (user) => {
      this.idUser = user.uid;
      this.userInfo = await this.userRepository.getById(`${this.idUser}`);
    });

    this.primengConfig.setTranslation({
      dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sa'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      dateFormat: "dd/mm/yy"
    });
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
        setTimeout(() => {
          this.showToast('info', 'Descrição', 'Agora vamos conhecer melhor o seu produto.');
        }, 400);
      }
    } else if (index == 1) {
      if (!this.fValue.step2.name) {
        this.showToast('error', 'Atenção', 'Preencha o campo nome!');
      } else if (!this.fValue.step2.description) {
        this.showToast('error', 'Atenção', 'Preencha o campo descrição!');
      } else if (!this.fValue.step2.price) {
        this.showToast('error', 'Atenção', 'Preencha o campo preço!');
      } else if (!this.fValue.step2.storeForActivation) {
        this.showToast('error', 'Atenção', 'Preencha o campo loja para ativação!');
      } else if (!this.fValue.step2.releaseDate) {
        this.showToast('error', 'Atenção', 'Escolha uma data de lançamento!');
      } else if (this.showGameGenres && this.fValue.step2.genres.length == 0) {
        this.showToast('error', 'Atenção', 'Escolha gêneros para o jogo!');
      } else if (this.showGameGenres && this.fValue.step2.playerModes.length == 0) {
        this.showToast('error', 'Atenção', 'Escolha modos de jogadores para o jogo!');
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
        this.scrollToTop();
        setTimeout(() => {
          this.showToast('info', 'Mídia', 'Ótimo! Agora vamos deixar o produto a cara dele.');
        }, 700);
      }
    } else if (index == 2) {
      if (this.selectedCapa.length == 0) {
        this.showToast('error', 'Atenção', 'Escolha uma capa!');
      } else if (this.selectedImages.length == 0) {
        if (this.pendingImages.length > 0) {
          this.showToast('error', 'Atenção', 'Faça o upload das imagens!');
        } else {
          this.showToast('error', 'Atenção', 'Escolha as imagens!');
        }
      } else if (!this.fValue.step3.titleDestaque) {
        this.showToast('error', 'Atenção', 'Preencha o título do destaque!');
      } else if (!this.fValue.step3.descriptionDestaque) {
        this.showToast('error', 'Atenção', 'Preencha a descrição do destaque!');
      } else if (!this.fValue.step3.capaDestaqueUrl) {
        this.showToast('error', 'Atenção', 'Preencha a capa do destaque!');
      } else {
        this.activeIndex++;
        setTimeout(() => {
          this.showToast('info', 'Códigos', 'Excelente! Informe a seguir as chaves de acesso para o produto.');
        }, 400);
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
              this.showToast('success', 'Conclusão', 'Chegamos ao fim! Obrigado por confiar na CodeShop.');
            }, 400);
          }, 1000);
        }
      }
    }
  }

  // Função para detectar mudança de categoria e mostrar o select de gêneros de jogos
  onProductCategoryChange(category: string): void {
    this.showGameGenres = (category === 'Jogos');
  }

  // Função para aplicar a cor ao card final do produto
  applyColorToDiv(): void {
    const fac = new FastAverageColor();
    fac.getColorAsync(this.capaUrl.sm)
      .then(color => {
        this.cardAnimationRef.nativeElement.style.backgroundColor = color.rgba;
        this.cardAnimationRef.nativeElement.style.color = color.isDark ? '#fff' : '#000';
      })
      .catch(e => {
        console.log(e);
      });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0
    });
  }

  onVisibleModalWelcome() {
    this.visibleModalWelcome = false;
    setTimeout(() => {
      this.showToast('info', 'Início', 'Escolha uma categoria para seu produto.');
    }, 400);
  }

  // -- Início - Funções para manipulação de imagens

  validateImage(fileType: string): boolean {
    if (fileType == "image/png"
      || fileType == "image/jpg"
      || fileType == "image/jpeg"
      || fileType == "image/webp"
      || fileType == "image/avif"
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

  onVideosChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedVideos = Array.from(event.target.files);
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

  // -- Fim - Funções para manipulação de imagens

  // -- Início - Funções para o dropzone e a manipulação de imagens  

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

  // -- Fim - Funções para o dropzone e a manipulação de imagens

  // Função para adicionar as chaves do produto
  addKeys(): void {
    const keysInput = this.form.get('step4.keysInput')?.value;
    if (keysInput) {
      const newKeys = keysInput.split(/[\s,]+/).filter(key => key.trim() !== '');
      this.keys.push(...newKeys);
      this.quantity = this.keys.length;
      this.form.get('step4.keysInput')?.reset();
    }
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
      descriptionDestaque: ['', Validators.required]
    }),
    step4: this.builder.group({
      keysInput: ['', Validators.required],
    })
  });

  get f() {
    return this.form.controls;
  }

  get fValue() {
    return this.form.getRawValue();
  }

  formatNameSearch(name: string): string {
    // Mapeamento dos números para sua versão escrita
    const numberMap: { [key: string]: string } = {
      "0": "zero",
      "1": "um",
      "2": "dois",
      "3": "três",
      "4": "quatro",
      "5": "cinco",
      "6": "seis",
      "7": "sete",
      "8": "oito",
      "9": "nove",
    };

    // Substituir números por sua versão escrita
    let formattedName = name.replace(/[0-9]/g, (num) => numberMap[num]);

    // Substituir caracteres acentuados pela versão sem acento e transformar em minúsculo
    formattedName = formattedName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Remover espaços em branco e caracteres especiais
    formattedName = formattedName.replace(/[\s\W_]+/g, "");

    return formattedName;
  }

  async handleSubmit() {
    try {
      const nameSearch = this.formatNameSearch(this.fValue.step2.name);
      let formValue;
      if (this.showGameGenres) {
        formValue = {
          category: this.fValue.step1.category,
          name: this.fValue.step2.name,
          nameSearch: nameSearch,
          description: this.fValue.step2.description,
          price: this.fValue.step2.price,
          storeForActivation: this.fValue.step2.storeForActivation,
          keys: this.keys,
          quantity: this.quantity,
          idUser: this.userInfo.idShop,
          capaUrl: { sm: '', lg: '' },
          imgUrls: { sm: [] as string[], lg: [] as string[] },
          videosUrls: [''],
          playerModes: Array.isArray(this.fValue.step2.playerModes) ? this.fValue.step2.playerModes : [this.fValue.step2.playerModes],
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
          },
          releaseDate: {
            dateFormat: this.formatDate(this.fValue.step2.releaseDate),
            bruteFormat: this.fValue.step2.releaseDate
          },
          titleDestaque: this.fValue.step3.titleDestaque,
          descriptionDestaque: this.fValue.step3.descriptionDestaque,
          capaDestaqueUrl: { sm: '', lg: '' },
          status: true
        };
      } else {
        formValue = {
          category: this.fValue.step1.category,
          name: this.fValue.step2.name,
          nameSearch: nameSearch,
          description: this.fValue.step2.description,
          price: this.fValue.step2.price,
          storeForActivation: this.fValue.step2.storeForActivation,
          keys: this.keys,
          quantity: this.quantity,
          idUser: this.userInfo.idShop,
          capaUrl: { sm: '', lg: '' },
          imgUrls: { sm: [] as string[], lg: [] as string[] },
          videosUrls: [''],
          releaseDate: {
            dateFormat: this.formatDate(this.fValue.step2.releaseDate),
            bruteFormat: this.fValue.step2.releaseDate
          },
          titleDestaque: this.fValue.step3.titleDestaque,
          descriptionDestaque: this.fValue.step3.descriptionDestaque,
          capaDestaqueUrl: { sm: '', lg: '' },
          status: true
        };
      }

      const id: string = await this.productService.create(formValue);
      this.idProduct = id;
      const capaUrlArray = await this.imgService.uploadProductMedia(
        id,
        'capa',
        this.selectedCapa
      );
      this.capaUrl = {
        sm: capaUrlArray.sm[0],
        lg: capaUrlArray.lg[0]
      }
      const capaDestaqueUrlArray = await this.imgService.uploadProductMedia(
        id,
        'capa-destaque',
        this.selectedCapaDestaque
      );
      this.capaDestaqueUrl = {
        sm: capaDestaqueUrlArray.sm[0],
        lg: capaDestaqueUrlArray.lg[0]
      }
      const imgUrls = await this.imgService.uploadProductMedia(
        id,
        'images',
        this.selectedImages
      );
      const videosUrls = await this.imgService.uploadProductVideos(
        id,
        this.selectedVideos
      );
      await this.productService.update({
        id,
        capaUrl: this.capaUrl,
        capaDestaqueUrl: this.capaDestaqueUrl,
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
