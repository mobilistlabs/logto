import type { User } from '@logto/schemas';
import { useTranslation } from 'react-i18next';

import Checkbox from '@/components/Checkbox';
import UserAvatar from '@/components/UserAvatar';
import { onKeyDownHandler } from '@/utils/a11y';

import * as styles from './index.module.scss';

type Props = {
  user: User;
  isSelected: boolean;
  onSelect: () => void;
};

function SourceUserItem({ user, isSelected, onSelect }: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });

  return (
    <div
      role="button"
      tabIndex={0}
      className={styles.item}
      onKeyDown={onKeyDownHandler(() => {
        onSelect();
      })}
      onClick={() => {
        onSelect();
      }}
    >
      <Checkbox
        checked={isSelected}
        onChange={() => {
          onSelect();
        }}
      />
      <UserAvatar user={user} size="micro" />
      <div className={styles.name}>{user.name ?? t('users.unnamed')}</div>
    </div>
  );
}

export default SourceUserItem;
