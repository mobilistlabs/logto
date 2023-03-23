const connector_details = {
  back_to_connectors: 'Retour à Connecteurs',
  check_readme: 'Vérifier le README',
  settings: 'General settings', // UNTRANSLATED
  settings_description:
    'Connectors play a critical role in Logto. With their help, Logto enables end-users to use passwordless registration or sign-in and the capabilities of signing in with social accounts.', // UNTRANSLATED
  parameter_configuration: 'Parameter configuration', // UNTRANSLATED
  test_connection: 'Test connection', // UNTRANSLATED
  save_error_empty_config: 'Veuillez entrer la configuration',
  send: 'Envoyer',
  send_error_invalid_format: 'Entrée non valide',
  edit_config_label: 'Entrez votre json ici',
  test_email_sender: 'Testez votre connecteur Email',
  test_sms_sender: 'Testez votre connecteur SMS',
  test_email_placeholder: 'john.doe@example.com',
  test_sms_placeholder: '+33 6 12 34 56 78',
  test_message_sent: 'Message de test envoyé',
  test_sender_description:
    'Logto utilise le modèle "Generic" pour les tests. Tu recevras un message si ton connecteur est correctement configuré.',
  options_change_email: 'Modifier le connecteur Email',
  options_change_sms: 'Changer le connecteur SMS',
  connector_deleted: 'Le connecteur a été supprimé avec succès',
  type_email: 'Connecteur Email',
  type_sms: 'Connecteur SMS',
  type_social: 'Connecteur Social',
  in_used_social_deletion_description:
    'This connector is in-use in your sign in experience. By deleting, <name/> sign in experience will be deleted in sign in experience settings. You will need to reconfigure it if you decide to add it back.', // UNTRANSLATED
  in_used_passwordless_deletion_description:
    'This {{name}} is in-use in your sign-in experience. By deleting, your sign-in experience will not work properly until you resolve the conflict. You will need to reconfigure it if you decide to add it back.', // UNTRANSLATED
  deletion_description:
    'You are removing this connector. It cannot be undone, and you will need to reconfigure it if you decide to add it back.', // UNTRANSLATED
};

export default connector_details;
