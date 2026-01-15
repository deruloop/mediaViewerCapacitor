import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.mediaplayer',
  appName: 'MediaPlayer Example',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    MediaPlayer: {
      // Opzioni specifiche del plugin
      // Tutte le opzioni sono opzionali
    },
  },
};

export default config;
