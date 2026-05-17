# CSE FYP Grade Calculator

A web-based calculator designed to help HKUST CSE Final Year Project (FYP) students calculate their final letter grade and numerical score based on Advisor and Reader assessments.

**Made by ThunderDora**

---

## Overview

This tool calculates your FYP final grade by:
1. Taking your component grades from your Advisor and Reader
2. Computing weighted scores based on official grading criteria
3. Displaying your final letter grade and numerical score

The calculator is **for informational purposes only** and helps you estimate your grade before official results are released.

---

## Features

### Main Menu Page
- Links to official FYP resources:
  - **FYP Grading Scheme**: https://cse.hkust.edu.hk/ug/fyp/grading/
  - **FYP Management System**: https://fypms.cse.ust.hk/ (check your official grades)
  - **FYP Program Information**: https://cse.hkust.edu.hk/ug/fyp/

### Grade Input
- Input grades for Advisor assessment (60% weight):
  - Project Proposal Report (5%)
  - Individual Ethics Essay (5%)
  - Project Progress Report (20%)
  - Final Project Report (35%)
  - Oral Presentation (30%)
  - Monthly Reports - 3 reports (5%)

- Input grades for Reader assessment (40% weight):
  - Project Proposal Report (5%)
  - Project Progress Report (15%)
  - Final Project Report (35%)
  - Oral Presentation (40%)
  - Poster Session / Video Trailer (5%)

### Grade Scale Reference
Displays the official HKUST 4.0 grade scale:
- A+ (4.30): ≥ 4.15
- A (4.00): 3.85 – 4.14
- A- (3.70): 3.50 – 3.84
- B+ (3.30): 3.15 – 3.49
- B (3.00): 2.85 – 3.14
- B- (2.70): 2.50 – 2.84
- C+ (2.30): 2.15 – 2.49
- C (2.00): 1.85 – 2.14
- C- (1.70): 1.50 – 1.84
- D (1.00): 1.00 – 1.49
- F (0.00): 0.00 – 0.99

### Final Results
- Clean, focused display showing:
  - Final numerical score (4 decimal places)
  - Final letter grade (large display)
  - Applicable score range
  - Navigation buttons to start over or return to menu

Boundary handling note: the calculator classifies grades using the displayed 4-decimal final score. For example, `3.4999` is classified as `B+`, while `3.5000` is classified as `A-`.

---

## How to Use

1. **Open the calculator** in your web browser
2. **Click "Start Calculator →"** on the menu page
3. **Enter your grades** by selecting from the dropdown menus for each criterion
4. **Fill in all criteria** - both Advisor and Reader assessments
5. **Click "Calculate Grade"** to see your results
6. **View your final letter grade and score**
7. **Click "Back to Menu"** to return to the start or **"Calculate Again"** to modify your input

---

## Important Notes

- **This is a calculator tool**, not the official HKUST grading system
- For your **official grades**, log into the FYP Management System: https://fypms.cse.ust.hk/
- You must have **committed your project** before checking official grades in the system
- The calculator uses the **official HKUST FYP grading scheme** as defined at: https://cse.hkust.edu.hk/ug/fyp/grading/
- All grades are calculated locally in your browser - **no data is sent to any server**

---

## Technical Details

### Grading Calculation
- Advisor contribution: 60% of final score
- Reader contribution: 40% of final score
- Each section's score is a weighted average of its components
- Final score is rounded to 4 decimal places, then mapped to a letter grade using the official threshold scale

### Monthly Reports (Advisor)
- 3 monthly reports with equal weight
- Each report is graded on the same scale
- Average of all 3 reports contributes 5% to Advisor assessment

---

## Browser Compatibility

- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Pure HTML/CSS/JavaScript - no external dependencies
- Fully functional offline

---

## File Information

- **File**: `index.html`
- **Size**: Single HTML file (self-contained)
- **No installation required**: Simply open in a web browser

---

## Version History

- **v1.0** - Initial release with Advisor and Reader assessment calculator
- Enhanced menu page with resource links
- Simplified results display showing only final grade
- 3 monthly reports support for Advisor assessment

---

**Created by ThunderDora**

Last Updated: May 2026

---

**Disclaimer**: This calculator is provided as a reference tool for students to estimate their FYP grades. The official grades from the FYP Management System are the authoritative source for your actual grade.
