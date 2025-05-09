import type { BaseTranslation } from '../i18n-types';

const en = {
  CommonWords: {
    Continue: 'Continue',
    Update: 'Update',
  },
  FormLocalRegister: {
    Label: 'Public name',
    Hint: 'How others will see you',
    Placeholder: 'ex: Daniel P. Becerra',
  },
  Dashboard: {
    PageEmitter: {
      Title: 'Call',
      MainButton: 'Help!',
      ListenersLabel: 'People waiting you:',
      EnableDetectionCheckbox: 'Allow others to detect this device',
    },
    PageReceiver: {
      Title: 'Lists',
      SelectedDevicesTab: {
        Title: 'Known devices',
        EmptyPlaceholder: 'No known devices',
      },
      SearchDevicesTab: {
        Title: 'Discover',
        DetectButton: 'Detect devices',
        EmptyPlaceholder: 'No devices nearby',
      },
    },
    PageSettings: {
      Title: 'Settings',
      FormLocalName: {
        Label: 'Current name',
        Hint: "Changes will be reflected on other people's devices.",
      },
    },
  },
} satisfies BaseTranslation;

export default en;
