import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.keyring.app",
  appName: "Keyring",
  webDir: "out",
  server: {
    url: "https://sentinela-client.vercel.app",
    cleartext: true,
  },
  android: {
    useLegacyBridge: true,
  },
};

export default config;
