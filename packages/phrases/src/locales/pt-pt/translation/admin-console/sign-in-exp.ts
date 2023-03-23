const sign_in_exp = {
  title: 'Experiência de login',
  description:
    'Personalize a interface de login para corresponder a sua marca e visualize em tempo real',
  tabs: {
    branding: 'Marca',
    sign_up_and_sign_in: 'Sign up and Sign in', // UNTRANSLATED
    others: 'Outros',
  },
  welcome: {
    title: 'Customize sign-in experience', // UNTRANSLATED
    description:
      'Get started fast with your first sign-in setup. This guide walks you through all the necessary settings.', // UNTRANSLATED
    get_started: 'Começar',
    apply_remind: 'Observe que a experiência de login será aplicada a todos os apps nesta conta.',
  },
  color: {
    title: 'COR',
    primary_color: 'Cor da marca',
    dark_primary_color: 'Cor da marca (tema escuro)',
    dark_mode: 'Ativar tema escuro',
    dark_mode_description:
      'O app terá um tema escuro gerado automaticamente com base na cor da marca e no algoritmo Logto. contudo é livre de personalizar.',
    dark_mode_reset_tip: 'Recalcular a cor do tema escuro com base na cor da marca.',
    reset: 'Recalcular',
  },
  branding: {
    title: 'ÁREA DE MARCA',
    ui_style: 'Estilo',
    favicon: 'Favicon', // UNTRANSLATED
    logo_image_url: 'URL do logotipo da app',
    logo_image_url_placeholder: 'https://your.cdn.domain/logo.png',
    dark_logo_image_url: 'URL do logotipo da app (tema escuro)',
    dark_logo_image_url_placeholder: 'https://your.cdn.domain/logo-dark.png',
    logo_image: 'App logo', // UNTRANSLATED
    dark_logo_image: 'App logo (Dark)', // UNTRANSLATED
    logo_image_error: 'App logo: {{error}}', // UNTRANSLATED
    favicon_error: 'Favicon: {{error}}', // UNTRANSLATED
  },
  custom_css: {
    title: 'Custom CSS', // UNTRANSLATED
    css_code_editor_title: 'Personalize your UI with Custom CSS', // UNTRANSLATED
    css_code_editor_description1: 'See the example of Custom CSS.', // UNTRANSLATED
    css_code_editor_description2: '<a>{{link}}</a>', // UNTRANSLATED

    css_code_editor_description_link_content: 'Learn more', // UNTRANSLATED
    css_code_editor_content_placeholder:
      'Enter your custom CSS to tailor the styles of anything to your exact specifications. Express your creativity and make your UI stand out.', // UNTRANSLATED
  },
  sign_up_and_sign_in: {
    identifiers_email: 'Email address', // UNTRANSLATED
    identifiers_phone: 'Phone number', // UNTRANSLATED
    identifiers_username: 'Username', // UNTRANSLATED
    identifiers_email_or_sms: 'Email address or phone number', // UNTRANSLATED
    identifiers_none: 'Not applicable', // UNTRANSLATED
    and: 'and', // UNTRANSLATED
    or: 'or', // UNTRANSLATED
    sign_up: {
      title: 'SIGN UP', // UNTRANSLATED
      sign_up_identifier: 'Sign-up identifier', // UNTRANSLATED
      identifier_description:
        'The sign-up identifier is required for account creation and must be included in your sign-in screen.', // UNTRANSLATED
      sign_up_authentication: 'Authentication setting for sign-up', // UNTRANSLATED
      authentication_description:
        'All selected actions will be obligatory for users to complete the flow.', // UNTRANSLATED
      set_a_password_option: 'Create your password', // UNTRANSLATED
      verify_at_sign_up_option: 'Verify at sign-up', // UNTRANSLATED
      social_only_creation_description: '(This apply to social only account creation)', // UNTRANSLATED
    },
    sign_in: {
      title: 'SIGN IN', // UNTRANSLATED
      sign_in_identifier_and_auth: 'Identifier and authentication settings for sign-in', // UNTRANSLATED
      description:
        'Users can sign in using any of the options available. Adjust the layout by drag and dropping below options.', // UNTRANSLATED
      add_sign_in_method: 'Add Sign-in Method', // UNTRANSLATED
      password_auth: 'Password', // UNTRANSLATED
      verification_code_auth: 'Verification code', // UNTRANSLATED
      auth_swap_tip: 'Swap the options below to determine which appears first in the flow.', // UNTRANSLATED
      require_auth_factor: 'You have to select at least one authentication factor.', // UNTRANSLATED
    },
    social_sign_in: {
      title: 'SOCIAL SIGN-IN', // UNTRANSLATED
      social_sign_in: 'Social sign-in', // UNTRANSLATED
      description:
        'Depending on the mandatory identifier you set up, your user may be asked to provide an identifier when signing up via social connector.', // UNTRANSLATED
      add_social_connector: 'Adicionar Conector Social',
      set_up_hint: {
        not_in_list: 'Not in the list?', // UNTRANSLATED
        set_up_more: 'Set up', // UNTRANSLATED
        go_to: 'other social connectors now.', // UNTRANSLATED
      },
    },
    tip: {
      set_a_password: 'A unique set of a password to your username is a must.', // UNTRANSLATED
      verify_at_sign_up:
        'We currently only support verified email. Your user base may contain a large number of poor-quality email addresses if no validation.', // UNTRANSLATED
      password_auth:
        'This is essential as you have enabled the option to set a password during the sign-up process.', // UNTRANSLATED
      verification_code_auth:
        'This is essential as you have only enabled the option to provide verification code when signing up. You’re free to uncheck the box when password set-up is allowed at the sign-up process.', // UNTRANSLATED
      delete_sign_in_method:
        'This is essential as you have selected {{identifier}} as a required identifier.', // UNTRANSLATED
    },
  },
  others: {
    terms_of_use: {
      title: 'TERMOS DE USO',
      terms_of_use: 'URL dos termos de uso',
      terms_of_use_placeholder: 'https://your.terms.of.use/',
      privacy_policy: 'URL da política de privacidade',
      privacy_policy_placeholder: 'https://your.privacy.policy/',
    },
    languages: {
      title: 'LÍNGUAS',
      enable_auto_detect: 'Enable auto-detect', // UNTRANSLATED
      description:
        "Your software detects the user's locale setting and switches to the local language. You can add new languages by translating UI from English to another language.", // UNTRANSLATED
      manage_language: 'Manage language', // UNTRANSLATED
      default_language: 'Default language', // UNTRANSLATED
      default_language_description_auto:
        'The default language will be used when the detected user language isn’t covered in the current language library.', // UNTRANSLATED
      default_language_description_fixed:
        'When auto-detect is off, the default language is the only language your software will show. Turn on auto-detect for language extension.', // UNTRANSLATED
    },
    manage_language: {
      title: 'Manage language', // UNTRANSLATED
      subtitle:
        'Localize the product experience by adding languages and translations. Your contribution can be set as the default language.', // UNTRANSLATED
      add_language: 'Add Language', // UNTRANSLATED
      logto_provided: 'Logto provided', // UNTRANSLATED
      key: 'Key', // UNTRANSLATED
      logto_source_values: 'Logto source values', // UNTRANSLATED
      custom_values: 'Custom values', // UNTRANSLATED
      clear_all_tip: 'Clear all values', // UNTRANSLATED
      unsaved_description: 'Changes won’t be saved if you leave this page without saving.', // UNTRANSLATED
      deletion_tip: 'Delete the language', // UNTRANSLATED
      deletion_title: 'Do you want to delete the added language?', // UNTRANSLATED
      deletion_description:
        'After deletion, your users won’t be able to browse in that language again.', // UNTRANSLATED
      default_language_deletion_title: 'Default language can’t be deleted.', // UNTRANSLATED
      default_language_deletion_description:
        '{{language}} is set as your default language and can’t be deleted. ', // UNTRANSLATED
    },
    advanced_options: {
      title: 'OPÇÕES AVANÇADAS',
      enable_user_registration: 'Enable user registration', // UNTRANSLATED
      enable_user_registration_description:
        'Enable or disallow user registration. Once disabled, users can still be added in the admin console but users can no longer establish accounts through the sign-in UI.', // UNTRANSLATED
    },
  },
  setup_warning: {
    no_connector_sms:
      'No SMS connector set-up yet. Before completing the configuration, users will not be able to sign in with this method. <a>{{link}}</a> in "Connectors"', // UNTRANSLATED
    no_connector_email:
      'No email connector set-up yet. Before completing the configuration, users will not be able to sign in with this method. <a>{{link}}</a> in "Connectors"', // UNTRANSLATED
    no_connector_social:
      'No social connector set-up yet. Before completing the configuration, users will not be able to sign in with this method. <a>{{link}}</a> in "Connectors"', // UNTRANSLATED
    no_added_social_connector:
      'Configurou alguns conectores sociais agora. Certifique-se de adicionar alguns a experiência de login.',
    setup_link: 'Set up',
  },
  save_alert: {
    description:
      'You are implementing new sign-in and sign-up procedures. All of your users may be affected by the new set-up. Are you sure to commit to the change?', // UNTRANSLATED
    before: 'Antes',
    after: 'Depois',
    sign_up: 'Sign-up', // UNTRANSLATED
    sign_in: 'Sign-in', // UNTRANSLATED
    social: 'Social', // UNTRANSLATED
  },
  preview: {
    title: 'Pre-visualização do login',
    live_preview: 'Live preview', // UNTRANSLATED
    live_preview_tip: 'Save to preview changes', // UNTRANSLATED
    native: 'Nativo',
    desktop_web: 'Web computador',
    mobile_web: 'Web móvel',
  },
};

export default sign_in_exp;
