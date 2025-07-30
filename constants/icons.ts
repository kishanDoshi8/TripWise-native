import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

export const ICONS = {
  logo: (size = 24, color = 'white') =>
    React.createElement(MaterialIcons, { name: 'hiking', size, color }),
  back: (size = 24, color = 'white') =>
    React.createElement(MaterialIcons, { name: 'arrow-back', size, color }),
};
