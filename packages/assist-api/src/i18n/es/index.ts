import type { BaseTranslation } from '../i18n-types';

const es = {
  CommonWords: {
    Continue: 'Continuar',
    Update: 'Actualizar',
  },
  FormLocalRegister: {
    Label: 'Nombre público',
    Desc: 'Como te veran otras personas',
    Placeholder: 'ej: Daniel P. Becerra',
  },
  Dashboard: {
    PageEmitter: {
      Title: 'Llamar',
      MainButton: 'Pedir Ayuda',
      EnableDetectionCheckbox: 'Permitir detectar este dispositivo',
    },
    PageReceiver: {
      Title: 'Listas',
      SelectedDevicesTab: {
        Title: 'Conocidos',
      },
      SearchDevicesTab: {
        DetectButton: 'Detectar dispositivos',
        Title: 'Buscar',
      },
    },
    PageSettings: {
      Title: 'Configuración',
      FormLocalName: 'Nombre actual',
    },
  },
} satisfies BaseTranslation;

export default es;
