import React from 'react';
import PlayIcon from '../icons/PlayIcon';

const StartButton: React.FC <
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  > = (
    props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  ) => (
    <button
      id='play-button'
      type='button'
      className='tranisition-all duration-300 h-12 w-24 p-2
      bg-emerald-400 hover:scale-110 hover:saturate-200 hover:
      flex items-center justify-center rounded-md shadow-md'
      {...props}
    >
      <PlayIcon className='h-8 w-auto text-white' />
    </button>
  );

export default StartButton;
