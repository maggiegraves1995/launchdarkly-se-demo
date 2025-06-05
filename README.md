# LaunchDarkly SE Homework

This is a React app demonstrating LaunchDarkly feature flag usage for release/remediation, targeted rollout, experimentation, and real-time updates.

## Features

- Feature Flag Integration using `launchdarkly-react-client-sdk`
- Real-time toggles (no page reload needed)
- User targeting by attributes (user key & team)
- Dropdown menu to demo multiple user personas
- Experimentation setup (need to run this for some time to generate actual results)
- **Please view How to Test section to validate results**

---

## React App Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/maggiegraves1995/launchdarkly-se-demo.git
cd launchdarkly-se-demo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Replace SDK Key
- Open `App.js`
- Replace `'YOUR_CLIENT_SIDE_ID'` with your actual LaunchDarkly **Client-side ID** (using PROD enviornment in this case)

### 4. Run the App
```bash
npm start
```
The app will be available at (http://localhost:3000)

---
##  LaunchDarkly Setup Guide

### 1. Create a LaunchDarkly Account
- Go to [https://launchdarkly.com](https://launchdarkly.com)
- Sign up or log in

### 2. Create a Project and Environment
1. Click your avatar (top right) → **Account Settings**
2. Under **Projects**, click **“Create project”**
   - Project Name: `SE Homework`
   - Environments: Use default (e.g., `Production`)
3. Once created, go to the **Production** environment

### 3. Get Your Client-Side SDK Key
1. Go to **Account Settings → Projects → Environments → Production**
2. Under **Client-side ID**, copy the key
3. In your `App.js`, replace `'YOUR_CLIENT_SIDE_ID'` with this value

> Only use the **Client-side ID** — not the SDK or mobile key.

### 4. Create Feature Flags

#### A. `feature_demo`
-- A general feature toggle to demonstrate basic flagging, release, and remediation
1. Go to **Feature Flags**
2. Click **“+ Create flag”**
   - Name: `Feature Demo`
   - Key: `feature_demo`
   - Type: Boolean (true/false)
3. Enable:
   - “SDKs using Client-side ID”
4. Save the flag

#### B. `testimonials_section`
- A new landing page component shown based on targeting rules
- Also used in the experimentation setup (see below)
1. Create another flag:
   - Name: `Testimonials Section`
   - Key: `testimonials_section`
   - Type: Boolean
2. Enable:
   - “SDKs using Client-side ID”
3. Save the flag

### 5. Set Up Targeting for `testimonials_section`
1. Open the `testimonials_section` flag
2. Toggle **Targeting ON**
3. Add **individual targeting**:
   - User key: `user789`
   - Serve: `true`
4. Add **rule-based targeting**:
   - Attribute: `team` **is** `marketing`
   - Serve: `true`
5. Set default rule (everyone else): `false`
6. Click **Save changes**

### 6. Create a Metric for Experimentation
1. Go to **Metrics** (left sidebar)
2. Click **“+ Create metric”**
   - Name: `Viewed Testimonials`
   - Key: `viewed-testimonials`
   - Kind: Custom
   - Event key: `viewed_testimonials`
   - Unit: Count
3. Save the metric

### 7. Create an Experiment
- You can measure whether the new `testimonials_section` improves engagement.
1. Go to the `testimonials_section` flag → **Experiments** tab
2. Click **“Create experiment”**
   - Name: `Testimonials Experiment`
   - Flag: `testimonials_section`
   - Environment: `Production`
   - Metric: `viewed-testimonials`
   - Target audience: All users (or just `marketing`)
   - Traffic split: 50/50 (or adjust)
3. Click **Start Experiment**
- **How it Works**
- A custom metric `viewed_testimonials` is fired when the section is shown
- An experiment is created around the `testimonials_section` flag

---
###  How to Test
1. **Part 1: Release and Remediate**
    - Toggle **feature_demo** feature flag "On" & "Off"
    - **Expected Result**
       - When flag is "**On**" message will display on React App "Feature is On"
       - When flag is "**Off**" message will display on React App "Feature is Off"
   
2. **Part 2: Target**
   - Toggle **testimonials_section** flag "On"
   - Go to React App and switch between the 3 users
   - **Expected Result**
     - When **Alice** is selected - Testimonial Section will appear on page
     - When **Carol** or **Bob** are selected - Page will remain the same & testimonial section will not be shown
    
3. **Part 3: Experiment**
   - Run Experiment in LaunchDarkly
   - Toggle between users in the React App to simulate page views
   - Stop Experiment after some time
   - Analyze Results 



