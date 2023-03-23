const connector_details = {
  back_to_connectors: 'Back to Connectors',
  check_readme: 'Check README',
  settings: 'General settings',
  settings_description:
    'Connectors play a critical role in Logto. With their help, Logto enables end-users to use passwordless registration or sign-in and the capabilities of signing in with social accounts.',
  parameter_configuration: 'Parameter configuration',
  test_connection: 'Test connection',
  save_error_empty_config: 'Please enter config',
  send: 'Send',
  send_error_invalid_format: 'Invalid input',
  edit_config_label: 'Enter your JSON here',
  test_email_sender: 'Test your email connector',
  test_sms_sender: 'Test your SMS connector',
  test_email_placeholder: 'john.doe@example.com',
  test_sms_placeholder: '+1 555-123-4567',
  test_message_sent: 'Test message sent',
  test_sender_description:
    'Logto uses the "Generic" template for testing. You will receive a message if your connector is rightly configured.',
  options_change_email: 'Change email connector',
  options_change_sms: 'Change SMS connector',
  connector_deleted: 'The connector has been successfully deleted',
  type_email: 'Email connector',
  type_sms: 'SMS connector',
  type_social: 'Social connector',
  in_used_social_deletion_description:
    'This connector is in-use in your sign in experience. By deleting, <name/> sign in experience will be deleted in sign in experience settings. You will need to reconfigure it if you decide to add it back.',
  in_used_passwordless_deletion_description:
    'This {{name}} is in-use in your sign-in experience. By deleting, your sign-in experience will not work properly until you resolve the conflict. You will need to reconfigure it if you decide to add it back.',
  deletion_description:
    'You are removing this connector. It cannot be undone, and you will need to reconfigure it if you decide to add it back.',
};

export default connector_details;
