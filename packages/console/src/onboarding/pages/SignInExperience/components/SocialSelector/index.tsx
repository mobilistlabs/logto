import { ConnectorType } from '@logto/schemas';

import ConnectorLogo from '@/components/ConnectorLogo';
import DangerousRaw from '@/components/DangerousRaw';
import UnnamedTrans from '@/components/UnnamedTrans';
import useConnectorGroups from '@/hooks/use-connector-groups';
import type { MultiCardSelectorOption } from '@/onboarding/components/CardSelector';
import { MultiCardSelector } from '@/onboarding/components/CardSelector';

import { fakeSocialTargetOptions } from '../../options';

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

function SocialSelector({ value, onChange }: Props) {
  const { data: connectorData, error } = useConnectorGroups();

  if (!connectorData || error) {
    return null;
  }

  const connectorOptions: MultiCardSelectorOption[] = connectorData
    .filter(({ type }) => type === ConnectorType.Social)
    .map((item) => {
      return {
        icon: <ConnectorLogo size="small" data={item} />,
        title: (
          <DangerousRaw>
            <UnnamedTrans resource={item.name} />
          </DangerousRaw>
        ),
        value: item.target,
        tag: 'general.demo',
      };
    });

  return (
    <MultiCardSelector
      options={[...connectorOptions, ...fakeSocialTargetOptions]}
      value={value}
      onChange={onChange}
    />
  );
}

export default SocialSelector;
