import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import FeedCarousel from 'soapbox/features/feed-filtering/feed-carousel';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
  PromoPanel,
  FundingPanel,
  CryptoDonatePanel,
  BirthdayPanel,
  CtaBanner,
  AnnouncementsPanel,
} from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useOwnAccount, useFeatures, useSoapboxConfig } from 'soapbox/hooks';

import Avatar from '../components/avatar';
import { Card, CardBody, Layout } from '../components/ui';
import ComposeForm from '../features/compose/components/compose-form';
import BundleContainer from '../features/ui/containers/bundle_container';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';

const HomePage: React.FC = ({ children }) => {
  const me = useAppSelector(state => state.me);
  const account = useOwnAccount();
  const features = useFeatures();
  const soapboxConfig = useSoapboxConfig();

  const composeBlock = useRef<HTMLDivElement>(null);

  const hasPatron = soapboxConfig.extensions.getIn(['patron', 'enabled']) === true;
  const hasCrypto = typeof soapboxConfig.cryptoAddresses.getIn([0, 'ticker']) === 'string';
  const cryptoLimit = soapboxConfig.cryptoDonatePanel.get('limit', 0);

  const acct = account ? account.acct : '';

  return (
    <>
      <Layout.Main className='pt-3 sm:pt-0 dark:divide-gray-800 space-y-3'>
        {me && (
          <Card variant='rounded' ref={composeBlock}>
            <CardBody>
              <div className='flex items-start space-x-4'>
                <Link to={`/@${acct}`}>
                  <Avatar account={account} size={46} />
                </Link>

                <ComposeForm
                  id='home'
                  shouldCondense
                  autoFocus={false}
                  clickableAreaRef={composeBlock}
                />
              </div>
            </CardBody>
          </Card>
        )}

        {features.feedUserFiltering && <FeedCarousel />}

        {children}

        {!me && (
          <BundleContainer fetchComponent={CtaBanner}>
            {Component => <Component key='cta-banner' />}
          </BundleContainer>
        )}
      </Layout.Main>

      <Layout.Aside>
        {!me && (
          <BundleContainer fetchComponent={SignUpPanel}>
            {Component => <Component />}
          </BundleContainer>
        )}
        {me && features.announcements && (
          <BundleContainer fetchComponent={AnnouncementsPanel}>
            {Component => <Component key='announcements-panel' />}
          </BundleContainer>
        )}
        {features.trends && (
          <BundleContainer fetchComponent={TrendsPanel}>
            {Component => <Component limit={5} />}
          </BundleContainer>
        )}
        {hasPatron && (
          <BundleContainer fetchComponent={FundingPanel}>
            {Component => <Component />}
          </BundleContainer>
        )}
        {hasCrypto && cryptoLimit > 0 && (
          <BundleContainer fetchComponent={CryptoDonatePanel}>
            {Component => <Component limit={cryptoLimit} />}
          </BundleContainer>
        )}
        <BundleContainer fetchComponent={PromoPanel}>
          {Component => <Component />}
        </BundleContainer>
        {features.birthdays && (
          <BundleContainer fetchComponent={BirthdayPanel}>
            {Component => <Component limit={10} />}
          </BundleContainer>
        )}
        {me && features.suggestions && (
          <BundleContainer fetchComponent={WhoToFollowPanel}>
            {Component => <Component limit={3} />}
          </BundleContainer>
        )}
        <LinkFooter key='link-footer' />
      </Layout.Aside>
    </>
  );
};

export default HomePage;
