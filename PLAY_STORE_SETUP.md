# PlanVerse: Google Play Console Setup Guide

This guide walks you through setting up your application in the Google Play Console for the first time.

### Prerequisites

1.  **A Signed App Bundle:** You must have a signed `.aab` file ready. Follow the `RELEASE_GUIDE.md` to generate one.
2.  **Google Play Developer Account:** You need an active Google Play Developer account. This requires a one-time registration fee.
3.  **Store Assets:** Prepare your app icon, feature graphic, and screenshots. See `docs/play-store-assets-guide.md` for specifications.

---

### Step 1: Create Your Application

1.  Go to the [Google Play Console](https://play.google.com/console).
2.  Click **Create app**.
3.  Fill in your app details:
    *   **App name:** `PlanVerse - Ultimate Planner Suite`
    *   **Default language:** Select your primary language.
    *   **App or game:** Select `App`.
    *   **Free or paid:** Select `Free`.
4.  Accept the declarations and click **Create app**.

---

### Step 2: Initial App Setup (Dashboard)

After creating your app, you'll be taken to the dashboard. You must complete a series of initial setup tasks.

1.  **Set up your app:** Click on **View tasks** in the "Set up your app" section.
    *   **Set privacy policy:** Provide a URL to your privacy policy. You can host a simple text file or use a privacy policy generator.
    *   **App access:** Specify if any parts of your app require login credentials. If so, provide test credentials for Google's review team.
    *   **Ads:** Declare whether your app contains ads.
    *   **Content ratings:** Complete the content rating questionnaire. For PlanVerse, the answers will likely result in an "Everyone" rating.
    *   **Target audience and content:** Specify the target age group.
    *   **News apps:** Declare if your app is a news app (it is not).
    *   **COVID-19 contact tracing...:** Select the appropriate option (likely "My app is not a publicly available...").
    *   **Data safety:** This is a critical section. You must declare what user data you collect, why, and if it's shared. Be thorough and transparent.
    *   **Government apps:** Declare if your app is developed on behalf of a government (it is not).

---

### Step 3: Create a Release and Upload Your Bundle

1.  In the left-hand menu, go to **Release** > **Testing** > **Internal testing**.
    *   *Recommendation:* Always start with an internal test release to catch issues before a wider audience sees them.
2.  Click **Create new release**.
3.  **App bundles:** Click **Upload** and select your signed `app-release.aab` file.
4.  **Release name:** The release name will be auto-populated (e.g., `1.0.0`). You can add release notes here describing what's new in this version.
5.  Click **Save**, then **Review release**.
6.  If there are no errors, click **Start rollout to Internal Testing**.

---

### Step 4: Complete Your Store Listing

This is your app's product page on the Google Play Store.

1.  In the left-hand menu, go to **Grow** > **Store presence** > **Main store listing**.
2.  **App details:**
    *   **App name:** `PlanVerse - Ultimate Planner Suite`
    *   **Short description:** Copy from `docs/play-store-listing.md`.
    *   **Full description:** Copy from `docs/play-store-listing.md`.
3.  **Graphics:**
    *   **App icon:** Upload your 512x512px icon.
    *   **Feature graphic:** Upload your 1024x500px graphic.
    *   **Phone screenshots:** Upload your phone screenshots.
    *   **7-inch and 10-inch tablet screenshots:** Upload tablet screenshots if you have them.
4.  Click **Save**.

---

### Step 5: Set Up Pricing & Distribution

1.  In the left-hand menu, go to **Monetize** > **App pricing**.
2.  Set the app to **Free**.
3.  Go to **Release** > **Setup** > **Advanced settings**.
4.  Under the **Countries / regions** tab, click **Add countries / regions**. Select the countries where you want your app to be available.
5.  Under the **Managed Google Play** tab, ensure the app is available to enterprise users if desired.

---

### Step 6: Promote to Production and Submit for Review

Once you have thoroughly tested your app in an internal or closed track and are confident it's ready, you can promote it to production.

1.  Go to the **Releases** overview page.
2.  Find your internal test release and click **Promote release**. Select **Production**.
3.  Review the release and click **Start rollout to production**.

Your app is now submitted for review by Google. The review process can take anywhere from a few hours to several days. You will be notified once your app is live on the Google Play Store.
