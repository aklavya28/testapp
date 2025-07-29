import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.app2',
  appName: 'DevRisingNidhi',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
   plugins: {
    EdgeToEdge: {
    },
  },
};

export default config;
