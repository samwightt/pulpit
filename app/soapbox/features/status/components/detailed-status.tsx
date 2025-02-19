import classNames from 'clsx';
import React, { useRef } from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';

import Icon from 'soapbox/components/icon';
import StatusMedia from 'soapbox/components/status-media';
import StatusReplyMentions from 'soapbox/components/status-reply-mentions';
import StatusContent from 'soapbox/components/status_content';
import SensitiveContentOverlay from 'soapbox/components/statuses/sensitive-content-overlay';
import { HStack, Stack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';
import { getActualStatus } from 'soapbox/utils/status';

import StatusInteractionBar from './status-interaction-bar';

import type { List as ImmutableList } from 'immutable';
import type { Attachment as AttachmentEntity, Status as StatusEntity } from 'soapbox/types/entities';

interface IDetailedStatus {
  status: StatusEntity,
  onOpenMedia: (media: ImmutableList<AttachmentEntity>, index: number) => void,
  onOpenVideo: (media: ImmutableList<AttachmentEntity>, start: number) => void,
  onToggleHidden: (status: StatusEntity) => void,
  showMedia: boolean,
  onOpenCompareHistoryModal: (status: StatusEntity) => void,
  onToggleMediaVisibility: () => void,
}

const DetailedStatus: React.FC<IDetailedStatus> = ({
  status,
  onToggleHidden,
  onOpenCompareHistoryModal,
  onToggleMediaVisibility,
  showMedia,
}) => {
  const intl = useIntl();
  const node = useRef<HTMLDivElement>(null);

  const handleOpenCompareHistoryModal = () => {
    onOpenCompareHistoryModal(status);
  };

  const actualStatus = getActualStatus(status);
  if (!actualStatus) return null;
  const { account } = actualStatus;
  if (!account || typeof account !== 'object') return null;

  const isUnderReview = actualStatus.visibility === 'self';
  const isSensitive = actualStatus.hidden;

  let statusTypeIcon = null;

  let quote;

  if (actualStatus.quote) {
    if (actualStatus.pleroma.get('quote_visible', true) === false) {
      quote = (
        <div className='quoted-actualStatus-tombstone'>
          <p><FormattedMessage id='actualStatuses.quote_tombstone' defaultMessage='Post is unavailable.' /></p>
        </div>
      );
    } else {
      quote = <QuotedStatus statusId={actualStatus.quote as string} />;
    }
  }

  if (actualStatus.visibility === 'direct') {
    statusTypeIcon = <Icon className='text-gray-700 dark:text-gray-600' src={require('@tabler/icons/mail.svg')} />;
  } else if (actualStatus.visibility === 'private') {
    statusTypeIcon = <Icon className='text-gray-700 dark:text-gray-600' src={require('@tabler/icons/lock.svg')} />;
  }

  return (
    <div className='border-box'>
      <div ref={node} className='detailed-actualStatus' tabIndex={-1}>
        <div className='mb-4'>
          <AccountContainer
            key={account.id}
            id={account.id}
            timestamp={actualStatus.created_at}
            avatarSize={42}
            hideActions
          />
        </div>

        <StatusReplyMentions status={actualStatus} />

        <Stack
          className={
            classNames('relative', {
              'min-h-[220px]': isUnderReview || isSensitive,
            })
          }
        >
          {(isUnderReview || isSensitive) ? (
            <SensitiveContentOverlay
              status={status}
              visible={showMedia}
              onToggleVisibility={onToggleMediaVisibility}
            />
          ) : null}

          <StatusContent status={actualStatus} />

          <StatusMedia
            status={actualStatus}
            showMedia={showMedia}
            onToggleVisibility={onToggleMediaVisibility}
          />

          {quote}
        </Stack>

        <HStack justifyContent='between' alignItems='center' className='py-2' wrap>
          <StatusInteractionBar status={actualStatus} />

          <HStack space={1} alignItems='center'>
            {statusTypeIcon}

            <span>
              <a href={actualStatus.url} target='_blank' rel='noopener' className='hover:underline'>
                <Text tag='span' theme='muted' size='sm'>
                  <FormattedDate value={new Date(actualStatus.created_at)} hour12 year='numeric' month='short' day='2-digit' hour='numeric' minute='2-digit' />
                </Text>
              </a>

              {actualStatus.edited_at && (
                <>
                  {' · '}
                  <div
                    className='inline hover:underline'
                    onClick={handleOpenCompareHistoryModal}
                    role='button'
                    tabIndex={0}
                  >
                    <Text tag='span' theme='muted' size='sm'>
                      <FormattedMessage id='actualStatus.edited' defaultMessage='Edited {date}' values={{ date: intl.formatDate(new Date(actualStatus.edited_at), { hour12: true, month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' }) }} />
                    </Text>
                  </div>
                </>
              )}
            </span>
          </HStack>
        </HStack>
      </div>
    </div>
  );
};

export default DetailedStatus;
