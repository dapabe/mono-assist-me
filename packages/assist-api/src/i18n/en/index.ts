import type { BaseTranslation } from '../i18n-types';

const en = {
  CommonWords: {
    Continue: 'Continue',
    Update: 'Update',
  },
  FormLocalRegister: {
    Label: 'Public name',
    Desc: 'How others will see you',
    Placeholder: 'ex: Daniel P. Becerra',
  },
  Dashboard: {
    PageEmitter: {
      Title: 'Call',
      MainButton: 'Help!',
      EnableDetectionCheckbox: 'Allow others to detect this device',
    },
    PageReceiver: {
      Title: 'Lists',
      SelectedDevicesTab: {
        Title: 'Known devices',
      },
      SearchDevicesTab: {
        DetectButton: 'Detect devices',
        Title: 'Search devices',
      },
    },
    PageSettings: {
      Title: 'Settings',
      FormLocalName: 'Current name',
    },
  },
} satisfies BaseTranslation;

export default en;
