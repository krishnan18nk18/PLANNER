# Play Store Assets Guide

This document outlines the requirements for the graphical assets needed for your Google Play Store listing. You should create these assets and place them in a `play-store-assets` directory in your project root for organization (this is not a requirement by Google).

### 1. App Icon (High-resolution)

This is the icon that will appear on the Google Play Store and on users' devices.

*   **Dimensions:** 512px x 512px
*   **Format:** 32-bit PNG (with alpha)
*   **Shape:** Full square. Google will dynamically apply a mask to ensure consistency. Do not round the corners yourself.
*   **File Name:** `app-icon.png`

### 2. Feature Graphic

This graphic is displayed at the top of your store listing. It's the most prominent visual element.

*   **Dimensions:** 1024px x 500px
*   **Format:** JPG or 24-bit PNG (no alpha)
*   **Content:** Should be bold, vivid, and concise. Avoid text-heavy content. It should tease the app's experience.
*   **File Name:** `feature-graphic.png`

### 3. Phone Screenshots

Screenshots showcasing your app's key features and user interface.

*   **Quantity:** Minimum of 2, maximum of 8.
*   **Format:** JPG or 24-bit PNG (no alpha).
*   **Aspect Ratio:** 16:9 or 9:16 (portrait or landscape).
*   **Dimensions:** Between 320px and 3840px. A common size is 1080px x 1920px for portrait.
*   **Content:** Highlight the most important features. You can add captions or use device frames to make them more appealing.
*   **File Naming:** `phone-screenshot-1.png`, `phone-screenshot-2.png`, etc.

### 4. Tablet Screenshots (Optional, but Recommended)

If your app has a tablet-optimized layout, showcasing it is highly recommended.

*   **7-inch Tablet Screenshots:**
    *   **Quantity:** Up to 8.
    *   **Format:** JPG or 24-bit PNG (no alpha).
    *   **Dimensions:** Between 320px and 3840px. A common size is 1200px x 1920px.
    *   **File Naming:** `7-inch-tablet-screenshot-1.png`, etc.

*   **10-inch Tablet Screenshots:**
    *   **Quantity:** Up to 8.
    *   **Format:** JPG or 24-bit PNG (no alpha).
    *   **Dimensions:** Between 320px and 3840px. A common size is 1600px x 2560px.
    *   **File Naming:** `10-inch-tablet-screenshot-1.png`, etc.

### 5. Privacy Policy URL

You must provide a URL to a privacy policy for your app. This is not an asset to be uploaded but a link you must provide in the Play Console.

*   **Requirement:** It must be a publicly accessible URL.
*   **Content:** The policy must disclose how your app collects, uses, and shares user data.
*   **Hosting:** You can use services like [Firebase Hosting](https://firebase.google.com/docs/hosting) to host a simple HTML page, or use a privacy policy generator service.
*   **Example URL:** `https://your-app-domain.com/privacy-policy.html`
