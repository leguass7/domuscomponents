import React from 'react';
import { Button } from '@storybook/react/demo';
import BoxCenter from '@domuscomponets/BoxCenter';

export default { title: 'BoxCenter' };

// export const withText = () => <Button>Hello Button</Button>;

export const withEmoji = () => (
    <BoxCenter>
  
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  
  </BoxCenter>
);