import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, HStack, Input } from './ui';

interface ICopyableInput {
  /** Text to be copied. */
  value: string,
}

/** An input with copy abilities. */
const CopyableInput: React.FC<ICopyableInput> = ({ value }) => {
  const input = useRef<HTMLInputElement>(null);

  const selectInput = () => {
    input.current?.select();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(value);
    } else {
      document.execCommand('copy');
    }
  };

  return (
    <HStack alignItems='center'>
      <Input
        ref={input}
        type='text'
        value={value}
        className='rounded-r-none'
        outerClassName='flex-grow'
        onClick={selectInput}
        readOnly
      />

      <Button
        theme='primary'
        className='mt-1 h-full rounded-l-none rounded-r-lg'
        onClick={selectInput}
      >
        <FormattedMessage id='input.copy' defaultMessage='Copy' />
      </Button>
    </HStack>
  );
};

export default CopyableInput;
