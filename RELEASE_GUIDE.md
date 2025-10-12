# PlanVerse: Android Release Guide

This guide provides the steps to generate a signed Android App Bundle (AAB) for submission to the Google Play Store.

## Step 1: Generate a Release Keystore

You need a cryptographic key to sign your application for release. This key is stored in a `.keystore` file.

**IMPORTANT:** Store this file in a safe, secure place. **If you lose this key, you will not be able to publish updates to your app.** Do not check this file into source control.

1.  Open your terminal.
2.  Run the following command. This will prompt you for passwords and other information.

```bash
keytool -genkey -v -keystore planverse-release-key.keystore -alias planverse -keyalg RSA -keysize 2048 -validity 10000
```

*   `-keystore planverse-release-key.keystore`: The name of the file to be generated.
*   `-alias planverse`: The alias to identify your key.
*   `-validity 10000`: The validity of the key in days (approx. 27 years).

3.  After running the command, a file named `planverse-release-key.keystore` will be created in the current directory. Move this file to the `android/` directory of your project.

## Step 2: Create Keystore Properties File

The build process needs to know your keystore passwords. You will provide these in a `keystore.properties` file.

1.  Create a new file named `keystore.properties` inside the `android/` directory.

2.  Add the following content to `android/keystore.properties`, replacing `YOUR_PASSWORD_HERE` with the passwords you created in Step 1.

```properties
storePassword=YOUR_PASSWORD_HERE
keyPassword=YOUR_PASSWORD_HERE
keyAlias=planverse
storeFile=planverse-release-key.keystore
```

This file is already included in the `.gitignore` file, so it will not be committed to your repository.

## Step 3: Build the Web Assets

Before generating the Android bundle, you must ensure your latest web code is built and synced to the native project.

Run the following command from the root of your project:

```bash
npm run android:sync
```

This command builds your Next.js app and copies the web assets into the `android` project.

## Step 4: Generate the Signed Android App Bundle (AAB)

The Android App Bundle is the format you will upload to the Google Play Store.

1.  Navigate into the `android` directory:
    ```bash
    cd android
    ```

2.  Run the Gradle `bundleRelease` command:
    ```bash
    ./gradlew bundleRelease
    ```
    On Windows, you may need to use `gradlew.bat bundleRelease`.

3.  Once the build is complete, you will find your signed AAB file at:
    `android/app/build/outputs/bundle/release/app-release.aab`

## What's Next?

Your signed `app-release.aab` file is now ready for upload to the Google Play Store.

For detailed instructions on creating your app listing and publishing it, see the **`PLAY_STORE_SETUP.md`** guide in this project.
