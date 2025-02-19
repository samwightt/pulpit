import classNames from 'clsx';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Icon from '../icon/icon';
import SvgIcon from '../icon/svg-icon';
import Tooltip from '../tooltip/tooltip';

const messages = defineMessages({
  showPassword: { id: 'input.password.show_password', defaultMessage: 'Show password' },
  hidePassword: { id: 'input.password.hide_password', defaultMessage: 'Hide password' },
});

/** Possible theme names for an Input. */
type InputThemes = 'normal' | 'search' | 'transparent';

interface IInput extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'maxLength' | 'onChange' | 'onBlur' | 'type' | 'autoComplete' | 'autoCorrect' | 'autoCapitalize' | 'required' | 'disabled' | 'onClick' | 'readOnly' | 'min' | 'pattern' | 'onKeyDown' | 'onKeyUp' | 'onFocus' | 'style' | 'id'> {
  /** Put the cursor into the input on mount. */
  autoFocus?: boolean,
  /** The initial text in the input. */
  defaultValue?: string,
  /** Extra class names for the <input> element. */
  className?: string,
  /** Extra class names for the outer <div> element. */
  outerClassName?: string,
  /** URL to the svg icon. Cannot be used with prepend. */
  icon?: string,
  /** Internal input name. */
  name?: string,
  /** Text to display before a value is entered. */
  placeholder?: string,
  /** Text in the input. */
  value?: string | number,
  /** Change event handler for the input. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  /** Whether to display the input in red. */
  hasError?: boolean,
  /** An element to display as prefix to input. Cannot be used with icon. */
  prepend?: React.ReactElement,
  /** An element to display as suffix to input. Cannot be used with password type. */
  append?: React.ReactElement,
  /** Theme to style the input with. */
  theme?: InputThemes,
}

/** Form input element. */
const Input = React.forwardRef<HTMLInputElement, IInput>(
  (props, ref) => {
    const intl = useIntl();

    const { type = 'text', icon, className, outerClassName, hasError, append, prepend, theme = 'normal', ...filteredProps } = props;

    const [revealed, setRevealed] = React.useState(false);

    const isPassword = type === 'password';

    const togglePassword = React.useCallback(() => {
      setRevealed((prev) => !prev);
    }, []);

    return (
      <div
        className={
          classNames('mt-1 relative shadow-sm', outerClassName, {
            'rounded-md': theme !== 'search',
            'rounded-full': theme === 'search',
          })
        }
      >
        {icon ? (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Icon src={icon} className='h-4 w-4 text-gray-700 dark:text-gray-600' aria-hidden='true' />
          </div>
        ) : null}

        {prepend ? (
          <div className='absolute inset-y-0 left-0 flex items-center'>
            {prepend}
          </div>
        ) : null}

        <input
          {...filteredProps}
          type={revealed ? 'text' : type}
          ref={ref}
          className={classNames({
            'text-gray-900 dark:text-gray-100 placeholder:text-gray-600 dark:placeholder:text-gray-600 block w-full sm:text-sm dark:ring-1 dark:ring-gray-800 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500':
              ['normal', 'search'].includes(theme),
            'rounded-md bg-white dark:bg-gray-900 border-gray-400 dark:border-gray-800': theme === 'normal',
            'rounded-full bg-gray-200 border-gray-200 dark:bg-gray-800 dark:border-gray-800 focus:bg-white': theme === 'search',
            'bg-transparent border-none': theme === 'transparent',
            'pr-7': isPassword || append,
            'text-red-600 border-red-600': hasError,
            'pl-8': typeof icon !== 'undefined',
            'pl-16': typeof prepend !== 'undefined',
          }, className)}
        />

        {/* eslint-disable-next-line no-nested-ternary */}
        {append ? (
          <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {append}
          </div>
        ) : null}

        {isPassword ? (
          <Tooltip
            text={
              revealed ?
                intl.formatMessage(messages.hidePassword) :
                intl.formatMessage(messages.showPassword)
            }
          >
            <div className='absolute inset-y-0 right-0 flex items-center'>
              <button
                type='button'
                onClick={togglePassword}
                tabIndex={-1}
                className='text-gray-700 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 h-full px-2 focus:ring-primary-500 focus:ring-2'
              >
                <SvgIcon
                  src={revealed ? require('@tabler/icons/eye-off.svg') : require('@tabler/icons/eye.svg')}
                  className='h-4 w-4'
                />
              </button>
            </div>
          </Tooltip>
        ) : null}
      </div>
    );
  },
);

export {
  Input as default,
  InputThemes,
};
