import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { ru } from 'vuetify/locale';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  components,
  directives,
  locale: {
    locale: 'ru',
    messages: { ru },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#722F37',
          secondary: '#8E3D46',
          accent: '#A2554A',
          error: '#A2554A',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#FBF8F7',
          surface: '#FFFFFF',
        },
      },
    },
  },
});
