import type { ConnectorType } from '@logto/schemas';
import { SignInIdentifier } from '@logto/schemas';
import { conditional } from '@silverhand/essentials';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import Draggable from '@/assets/images/draggable.svg';
import Minus from '@/assets/images/minus.svg';
import SwitchArrowIcon from '@/assets/images/switch-arrow.svg';
import Checkbox from '@/components/Checkbox';
import IconButton from '@/components/IconButton';
import { Tooltip } from '@/components/Tip';
import { signInIdentifierPhrase } from '@/pages/SignInExperience/constants';
import type { SignInMethod } from '@/pages/SignInExperience/types';

import ConnectorSetupWarning from '../ConnectorSetupWarning';
import * as styles from './index.module.scss';

type Props = {
  signInMethod: SignInMethod;
  isPasswordCheckable: boolean;
  isVerificationCodeCheckable: boolean;
  isDeletable: boolean;
  requiredConnectors: ConnectorType[];
  hasError?: boolean;
  errorMessage?: string;
  onVerificationStateChange: (
    verification: 'password' | 'verificationCode',
    checked: boolean
  ) => void;
  onToggleVerificationPrimary: () => void;
  onDelete: () => void;
};

function SignInMethodItem({
  signInMethod: { identifier, password, verificationCode, isPasswordPrimary },
  isPasswordCheckable,
  isVerificationCodeCheckable,
  isDeletable,
  requiredConnectors,
  hasError,
  errorMessage,
  onVerificationStateChange,
  onToggleVerificationPrimary,
  onDelete,
}: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });

  return (
    <div>
      <div key={identifier} className={styles.signInMethodItem}>
        <div className={classNames(styles.signInMethod, hasError && styles.error)}>
          <div className={styles.identifier}>
            <Draggable className={styles.draggableIcon} />
            {t(signInIdentifierPhrase[identifier])}
          </div>
          <div
            className={classNames(
              styles.authentication,
              !isPasswordPrimary && styles.verifyCodePrimary
            )}
          >
            <Checkbox
              className={styles.checkBox}
              label={t('sign_in_exp.sign_up_and_sign_in.sign_in.password_auth')}
              checked={password}
              disabled={!isPasswordCheckable}
              tooltip={conditional(
                !isPasswordCheckable && t('sign_in_exp.sign_up_and_sign_in.tip.password_auth')
              )}
              onChange={(checked) => {
                onVerificationStateChange('password', checked);
              }}
            />
            {identifier !== SignInIdentifier.Username && (
              <>
                <Tooltip
                  anchorClassName={styles.swapButton}
                  content={t('sign_in_exp.sign_up_and_sign_in.sign_in.auth_swap_tip')}
                >
                  <IconButton onClick={onToggleVerificationPrimary}>
                    <SwitchArrowIcon />
                  </IconButton>
                </Tooltip>
                <Checkbox
                  className={styles.checkBox}
                  label={t('sign_in_exp.sign_up_and_sign_in.sign_in.verification_code_auth')}
                  checked={verificationCode}
                  disabled={!isVerificationCodeCheckable}
                  tooltip={conditional(
                    !isVerificationCodeCheckable &&
                      t('sign_in_exp.sign_up_and_sign_in.tip.verification_code_auth')
                  )}
                  onChange={(checked) => {
                    onVerificationStateChange('verificationCode', checked);
                  }}
                />
              </>
            )}
          </div>
        </div>
        <Tooltip
          content={conditional(
            !isDeletable &&
              t('sign_in_exp.sign_up_and_sign_in.tip.delete_sign_in_method', {
                identifier: String(t(signInIdentifierPhrase[identifier])).toLocaleLowerCase(),
              })
          )}
        >
          <IconButton disabled={!isDeletable} onClick={onDelete}>
            <Minus />
          </IconButton>
        </Tooltip>
      </div>
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      <ConnectorSetupWarning requiredConnectors={requiredConnectors} />
    </div>
  );
}

export default SignInMethodItem;
