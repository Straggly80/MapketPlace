import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // Evita que se oculte antes de estar listo
      launchShowDuration: 3000, // Tiempo en ms (3 segundos)
      splashFullScreen: true,
      splashImmersive: true,
      backgroundColor: "#ffffff", // Mismo color de fondo del splash
      androidScaleType: "CENTER_CROP" // Para que no se deforme la imagen
    }
  }
};


/* const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'MapketPlace',
  webDir: 'www',
   plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: "#000000ff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: false,
      splashImmersive: false,
      layoutName: "launch_screen",
      useDialog: false,
    },
  },
}; */

export default config;
