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

## Setup Instructions

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

## Feature Flags Used

### `feature_demo`
- A general feature toggle to demonstrate basic flagging, release, and remediation

### `testimonials_section`
- A new landing page component shown based on targeting rules
- Also used in the experimentation setup (see below)

---

## User Context Switching
Use the dropdown in the UI to instantly switch between demo users:
- **Alice** (marketing)
- **Bob** (finance)
- **Carol** (engineering)

Each has a unique key, team, and location used for targeting.

---

## Targeting Setup in LaunchDarkly

1. Go to `testimonials_section` flag in LaunchDarkly
2. Enable targeting
3. Add individual targeting for key `user789` (Alice)
4. Add rule-based targeting:
   - If `team` is `marketing`, serve true

Users who don’t match any rule will not see the section.

---

## Experimentation

You can measure whether the new `testimonials_section` improves engagement.

### How it Works
- A custom metric `viewed_testimonials` is fired when the section is shown
- An experiment is created around the `testimonials_section` flag

### Setup Steps
1. Go to **Metrics** → Create metric:
   - Name: Viewed Testimonials
   - Key: `viewed-testimonials`
   - Event Key: `viewed_testimonials`
   - Kind: Page View / Custom

2. In `App.js`, the following is tracked:
```js
if (flags.testimonials_section && ldClient) {
  ldClient.track('viewed_testimonials');
}
```

3. Go to the flag → “Experiments” tab → Create experiment:
   - Use flag: `testimonials_section`
   - Assign metric: `viewed-testimonials`
   - Use 50/50 split

4. Run experiment, collect data, and measure impact

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



