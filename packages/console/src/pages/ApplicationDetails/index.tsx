import type { Application, ApplicationResponse, SnakeCaseOidcConfig } from '@logto/schemas';
import { ApplicationType } from '@logto/schemas';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';

import Delete from '@/assets/images/delete.svg';
import More from '@/assets/images/more.svg';
import ActionMenu, { ActionMenuItem } from '@/components/ActionMenu';
import ApplicationIcon from '@/components/ApplicationIcon';
import Button from '@/components/Button';
import Card from '@/components/Card';
import CopyToClipboard from '@/components/CopyToClipboard';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import DetailsForm from '@/components/DetailsForm';
import DetailsPage from '@/components/DetailsPage';
import Drawer from '@/components/Drawer';
import TabNav, { TabNavItem } from '@/components/TabNav';
import UnsavedChangesAlertModal from '@/components/UnsavedChangesAlertModal';
import type { RequestError } from '@/hooks/use-api';
import useApi from '@/hooks/use-api';
import useDocumentationUrl from '@/hooks/use-documentation-url';
import { applicationTypeI18nKey } from '@/types/applications';
import { withAppInsights } from '@/utils/app-insights';

import Guide from '../Applications/components/Guide';
import GuideModal from '../Applications/components/Guide/GuideModal';
import AdvancedSettings from './components/AdvancedSettings';
import Settings from './components/Settings';
import * as styles from './index.module.scss';

const mapToUriFormatArrays = (value?: string[]) =>
  value?.filter(Boolean).map((uri) => decodeURIComponent(uri));

const mapToUriOriginFormatArrays = (value?: string[]) =>
  value?.filter(Boolean).map((uri) => decodeURIComponent(new URL(uri).origin));

function ApplicationDetails() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const isGuideView = !!id && pathname === `/applications/${id}/guide`;
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });
  const { data, error, mutate } = useSWR<ApplicationResponse, RequestError>(
    id && `api/applications/${id}`
  );
  const {
    data: oidcConfig,
    error: fetchOidcConfigError,
    mutate: mutateOidcConfig,
  } = useSWR<SnakeCaseOidcConfig, RequestError>('oidc/.well-known/openid-configuration');
  const isLoading = (!data && !error) || (!oidcConfig && !fetchOidcConfigError);
  const requestError = error ?? fetchOidcConfigError;
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  const [isDeleteFormOpen, setIsDeleteFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const api = useApi();
  const navigate = useNavigate();
  const formMethods = useForm<Application & { isAdmin: boolean }>();
  const { getDocumentationUrl } = useDocumentationUrl();

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = formMethods;

  useEffect(() => {
    if (!data) {
      return;
    }

    reset(data);
  }, [data, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    if (!data || isSubmitting) {
      return;
    }

    await api
      .patch(`api/applications/${data.id}`, {
        json: {
          ...formData,
          oidcClientMetadata: {
            ...formData.oidcClientMetadata,
            redirectUris: mapToUriFormatArrays(formData.oidcClientMetadata.redirectUris),
            postLogoutRedirectUris: mapToUriFormatArrays(
              formData.oidcClientMetadata.postLogoutRedirectUris
            ),
          },
          customClientMetadata: {
            ...formData.customClientMetadata,
            corsAllowedOrigins: mapToUriOriginFormatArrays(
              formData.customClientMetadata.corsAllowedOrigins
            ),
          },
        },
      })
      .json<Application>();
    void mutate();
    toast.success(t('general.saved'));
  });

  const onDelete = async () => {
    if (!data || isDeleting) {
      return;
    }

    try {
      await api.delete(`api/applications/${data.id}`);
      setIsDeleted(true);
      setIsDeleting(false);
      setIsDeleteFormOpen(false);
      toast.success(t('application_details.application_deleted', { name: data.name }));
      navigate(`/applications`);
    } catch {
      setIsDeleting(false);
    }
  };

  const onCloseDrawer = () => {
    setIsReadmeOpen(false);
  };

  return (
    <DetailsPage
      backLink="/applications"
      backLinkTitle="application_details.back_to_applications"
      isLoading={isLoading}
      error={requestError}
      onRetry={() => {
        void mutate();
        void mutateOidcConfig();
      }}
    >
      {data && oidcConfig && (
        <>
          <Card className={styles.header}>
            <ApplicationIcon type={data.type} className={styles.icon} />
            <div className={styles.metadata}>
              <div className={styles.name}>{data.name}</div>
              <div className={styles.details}>
                <div className={styles.type}>{t(`${applicationTypeI18nKey[data.type]}.title`)}</div>
                <div className={styles.verticalBar} />
                <div className={styles.text}>App ID</div>
                <CopyToClipboard size="small" value={data.id} />
              </div>
            </div>
            <div className={styles.operations}>
              {/* TODO: @Charles figure out a better way to check guide availability */}
              <Button
                title="application_details.check_guide"
                size="large"
                onClick={() => {
                  if (data.type === ApplicationType.MachineToMachine) {
                    window.open(
                      getDocumentationUrl('/docs/recipes/integrate-logto/machine-to-machine'),
                      '_blank'
                    );

                    return;
                  }
                  setIsReadmeOpen(true);
                }}
              />
              <Drawer isOpen={isReadmeOpen} onClose={onCloseDrawer}>
                <Guide isCompact app={data} onClose={onCloseDrawer} />
              </Drawer>
              <ActionMenu
                buttonProps={{ icon: <More className={styles.moreIcon} />, size: 'large' }}
                title={t('general.more_options')}
              >
                <ActionMenuItem
                  icon={<Delete />}
                  type="danger"
                  onClick={() => {
                    setIsDeleteFormOpen(true);
                  }}
                >
                  {t('general.delete')}
                </ActionMenuItem>
              </ActionMenu>
              <DeleteConfirmModal
                isOpen={isDeleteFormOpen}
                isLoading={isDeleting}
                expectedInput={data.name}
                inputPlaceholder={t('application_details.enter_your_application_name')}
                className={styles.deleteConfirm}
                onCancel={() => {
                  setIsDeleteFormOpen(false);
                }}
                onConfirm={onDelete}
              >
                <div className={styles.description}>
                  <Trans components={{ span: <span className={styles.highlight} /> }}>
                    {t('application_details.delete_description', { name: data.name })}
                  </Trans>
                </div>
              </DeleteConfirmModal>
            </div>
          </Card>
          <TabNav>
            <TabNavItem href={`/applications/${data.id}`}>{t('general.settings_nav')}</TabNavItem>
          </TabNav>
          <FormProvider {...formMethods}>
            <DetailsForm
              isDirty={isDirty}
              isSubmitting={isSubmitting}
              onDiscard={reset}
              onSubmit={onSubmit}
            >
              <Settings data={data} />
              <AdvancedSettings applicationType={data.type} oidcConfig={oidcConfig} />
            </DetailsForm>
          </FormProvider>
        </>
      )}
      <UnsavedChangesAlertModal hasUnsavedChanges={!isDeleted && isDirty} />
      {isGuideView && (
        <GuideModal
          app={data}
          onClose={(id) => {
            navigate(`/applications/${id}`);
          }}
        />
      )}
    </DetailsPage>
  );
}

export default withAppInsights(ApplicationDetails);
