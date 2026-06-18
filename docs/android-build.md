# Android build (Capacitor)

Building QR ships to Google Play as an Android App Bundle (AAB) via Capacitor.
The web app is built with Vite, copied into the native shell, and packaged with Gradle.

## Prerequisites

- Node 20+ and `npm install`
- JDK 17+ (JDK 21 tested)
- Android SDK (platform 35 + build-tools). `android/local.properties` must point at it:
  ```properties
  sdk.dir=C:/Users/<you>/AppData/Local/Android/Sdk
  ```
  (Use forward slashes — a Java properties file treats `\` as an escape.)

## Sync the web build into the native project

```bash
npm run build          # produces dist/
npx cap sync android   # copies dist/ + plugins into android/
```

Run this after every web change before building the app.

## Debug build (validate / test on a device)

```bash
cd android
./gradlew assembleDebug
# output: android/app/build/outputs/apk/debug/app-debug.apk
```

Install on a connected device: `adb install -r app/build/outputs/apk/debug/app-debug.apk`.

## Release AAB for Play Store

1. Create an upload keystore **once** (keep it safe and private — losing it blocks updates):
   ```bash
   keytool -genkey -v -keystore building-qr-upload.jks -keyalg RSA -keysize 2048 \
     -validity 10000 -alias upload
   ```
2. Create `android/keystore.properties` (gitignored):
   ```properties
   storeFile=C:/path/to/building-qr-upload.jks
   storePassword=********
   keyAlias=upload
   keyPassword=********
   ```
3. Build the signed bundle:
   ```bash
   cd android
   ./gradlew bundleRelease
   # output: android/app/build/outputs/bundle/release/app-release.aab
   ```
   Without `keystore.properties`, `bundleRelease` still builds but the AAB is **unsigned**
   (not uploadable).

## Versioning

Bump in `android/app/build.gradle`:

- `versionCode` — integer, +1 every Play upload
- `versionName` — user-facing string (e.g. `1.0.1`)

## App identity

- applicationId / namespace: `app.buildingqr`
- App name: `Building QR` (`android/app/src/main/res/values/strings.xml`)
- Icon / splash: regenerate from `assets/` with `npx capacitor-assets generate --android`

## Permissions

Capacitor includes `INTERNET` (needed for the WebView bridge and opening external links
such as the privacy page / GitHub). QR generation itself is fully offline/local — no
network request is made for it, and there is no analytics/ads SDK.

## Back button

Handled in `src/app/App.tsx`: navigates back when possible, otherwise exits the app.
