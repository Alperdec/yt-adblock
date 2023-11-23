import React from 'react';
import StopIcon from '../icons/StopIcon';

const StopButton: React.FC <
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  > = (
    props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  ) => (
    <button
      id='stop-button'
      type='button'
      className='tranisition-all duration-300 h-12 w-24 p-2
      bg-rose-400 hover:scale-110 hover:saturate-200 hover:
      flex items-center justify-center rounded-md shadow-md'
      {...props}
    >
      <StopIcon className='h-8 w-auto text-white' />
    </button>
  );

export default StopButton;