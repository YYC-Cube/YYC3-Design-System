import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';
import './theme-switcher';

const theme = create({
  base: 'light',
  brandTitle: 'YYC³ Design System',
  brandUrl: 'https://github.com/yyc3',
  brandImage: null,
});

addons.setConfig({
  theme,
});
