// custom-theme.ts
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const CustomTheme = definePreset(Aura, {
  semantic: {
    // Paleta primária: tons de roxo
    primary: {
      50: '#f3e8ff', // Exemplo de tom muito claro
      100: '#e9d5ff',
      200: '#d8b4fe',
      300: '#c084fc',
      400: '#a855f7',
      500: '#8b5cf6', // $purpleColor
      600: '#6b46c1', // $hoverPurpleColor
      700: '#6b46c1', // Pode ser repetido ou ajustado conforme necessário
      800: '#5b21b6',
      900: '#4c1d95', // $boderPurpleColor
      950: '#4c1d95',
    },
    // Esquema de cores para light e dark
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff', // Fundo branco
        },
        text: {
          primary: '#181818', // Texto em preto ($blackColor)
        },
      },
      dark: {
        surface: {
          0: '#ffffff', // Fundo preto
        },
        text: {
          primary: '#ffffff', // Texto em branco
        },
      },
    },
  },
  components: {
    button: {
      extend: {
        confirm: {
          background: '#10b981', // $greenColor
          hoverBackground: '#0f995f', // $hoverGreenColor
          color: '#ffffff',
        },
        cancel: {
          background: '#ef4444', // $RedColor
          hoverBackground: '#cc3b3b', // $hoverRedColor
          color: '#ffffff',
        },
      },
      css: ({ dt }: { dt: (token: string) => string }) => `

      `,
    },
    datepicker: {
      colorScheme: {
        light: {
          today: {
            color: '#ffffff', // aqui você define a cor desejada
            // você também pode customizar outros tokens, como o background:
            background: '#8b5cf6',
          },
        },
        dark: {
          today: {
            color: '#ffffff',
            background: '#8b5cf6',
          },
        },
      },
    },
    calendar: {
      css: ({ dt }: { dt: (token: string) => string }) => `
    /* Estilo do container do calendário popup */
    .p-datepicker {
      background-color: #181818; /* Fundo preto */
      color: #ffffff;            /* Texto branco */
    }

    /* Estilo dos dias na tabela do calendário */
    .p-datepicker .p-datepicker-calendar td {
      color: #ffffff;
    }
      .p-datepicker-day-selected{
        color: #ffffff !important;
      }
    /* Estilo do dia selecionado (indicador roxo e número branco) */
    .p-datepicker .p-datepicker-calendar td.p-highlight,
    .p-datepicker .p-datepicker-calendar td.p-highlight:hover {
      background-color: #8b5cf6 !important;
      color: #ffffff !important;
    }

    /* Caso o input interno do datepicker precise ser forçado */
    .p-calendar .p-inputtext {
      background-color: #ffffff;
      color: #181818;
    }
  `,
    },
  },
  // CSS global opcional para garantir que o input do datepicker use os estilos desejados
  css: ({ dt }: { dt: (token: string) => string }) => `
    .p-inputtext {
      background-color: #ffffff !important;
      color: #181818 !important;
    }
  `,
});

export default CustomTheme;
