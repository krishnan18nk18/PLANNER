import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.planverse',
  appName: 'PlanVerse',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
