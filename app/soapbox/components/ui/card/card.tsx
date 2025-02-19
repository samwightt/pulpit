import classNames from 'clsx';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Text } from 'soapbox/components/ui';
import SvgIcon from 'soapbox/components/ui/icon/svg-icon';

const sizes = {
  md: 'p-4 sm:rounded-xl',
  lg: 'p-4 sm:p-6 sm:rounded-xl',
  xl: 'p-4 sm:p-10 sm:rounded-3xl',
};

const messages = defineMessages({
  back: { id: 'card.back.label', defaultMessage: 'Back' },
});

interface ICard {
  /** The type of card. */
  variant?: 'default' | 'rounded'
  /** Card size preset. */
  size?: keyof typeof sizes
  /** Extra classnames for the <div> element. */
  className?: string
  /** Elements inside the card. */
  children: React.ReactNode
}

/** An opaque backdrop to hold a collection of related elements. */
const Card = React.forwardRef<HTMLDivElement, ICard>(({ children, variant = 'default', size = 'md', className, ...filteredProps }, ref): JSX.Element => (
  <div
    ref={ref}
    {...filteredProps}
    className={classNames({
      'bg-white dark:bg-primary-900 text-gray-900 dark:text-gray-100 shadow-lg dark:shadow-none overflow-hidden': variant === 'rounded',
      [sizes[size]]: variant === 'rounded',
    }, className)}
  >
    {children}
  </div>
));

interface ICardHeader {
  backHref?: string,
  onBackClick?: (event: React.MouseEvent) => void
}

/**
 * Card header container with back button.
 * Typically holds a CardTitle.
 */
const CardHeader: React.FC<ICardHeader> = ({ children, backHref, onBackClick }): JSX.Element => {
  const intl = useIntl();

  const renderBackButton = () => {
    if (!backHref && !onBackClick) {
      return null;
    }

    const Comp: React.ElementType = backHref ? Link : 'button';
    const backAttributes = backHref ? { to: backHref } : { onClick: onBackClick };

    return (
      <Comp {...backAttributes} className='mr-2 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:ring-2' aria-label={intl.formatMessage(messages.back)}>
        <SvgIcon src={require('@tabler/icons/arrow-left.svg')} className='h-6 w-6' />
        <span className='sr-only' data-testid='back-button'>{intl.formatMessage(messages.back)}</span>
      </Comp>
    );
  };

  return (
    <div className='mb-4 flex flex-row items-center'>
      {renderBackButton()}

      {children}
    </div>
  );
};

interface ICardTitle {
  title: React.ReactNode
}

/** A card's title. */
const CardTitle: React.FC<ICardTitle> = ({ title }): JSX.Element => (
  <Text size='xl' weight='bold' tag='h1' data-testid='card-title' truncate>{title}</Text>
);

/** A card's body. */
const CardBody: React.FC = ({ children }): JSX.Element => (
  <div data-testid='card-body'>{children}</div>
);

export { Card, CardHeader, CardTitle, CardBody };
