# RCG Recruitment Management System

**Team Name:** RCG  
**Team Leader:** Rusiru Thamara Kaluarachchi  
**Contact Email:** hello@rusiru.dev  

---

## Project Overview

The **RCG Recruitment Management System** is a web application designed to streamline the recruitment process for companies and organizations. It efficiently handles and sorts a large number of recruiter applications, from bulk CV uploads to conducting online interviews, all within a single platform.

Recruiters can securely upload multiple CVs, which are analyzed using AI to rank candidates and generate detailed profile insights. The system also automates interview scheduling and notifications, and provides a built-in video calling feature for seamless online interviews.

---

## Problem Statement

Recruiters often face challenges when processing a high volume of applications. Manual sorting and reviewing of CVs is:

- Time-consuming  
- Prone to human bias  
- Inefficient and resource-intensive  

Additionally, managing interviews across multiple platforms adds complexity and reduces productivity.  

There is a need for a centralized platform that automates CV analysis, candidate ranking, interview scheduling, notifications, and online interviews—streamlining the recruitment workflow and improving decision-making accuracy.

---

## Proposed Solution

The proposed solution is a **web-based recruitment management system** that:

1. **Automates CV Analysis** – AI evaluates candidate profiles and ranks them based on predefined criteria.  
3. **Streamlines Interview Management** – Recruiters can schedule interviews and send automated email invitations.  
4. **Integrates Video Interviews** – Built-in video calling allows seamless online interviews.  

This solution reduces manual effort, minimizes bias, and offers a complete end-to-end recruitment experience within a single platform.

---

## Key Features

- **Bulk CV Upload** – Upload multiple CVs at once to save time.  
- **AI-Based CV Analysis & Ranking** – Automated ranking of applicants using AI.  
- **Candidate Profile Analysis View** – Detailed insights for informed decision-making.  
- **Automated Interview Email Invitations** – Sends emails to shortlisted candidates automatically.  
- **Interview Scheduling System** – Plan interviews efficiently based on availability.  
- **Built-in Video Interview System** – Conduct interviews directly within the platform.  
- **End-to-End Recruitment Management** – From CV submission to final interview, all in one system.  

---

## Technology Stack

- **Frontend:** Next.js  
- **Backend:** Express.js  
- **Authentication:** Firebase  
- **Database:** Firestore  
- **AI Model:** Gemini AI Pro API  

---

## How It Works

1. **Login & Authentication:** Recruiters log in via Firebase Authentication.  
2. **Bulk CV Upload:** Recruiters upload multiple CVs, which are processed to extract text content.  
3. **AI Analysis:** Extracted CV data is sent to Gemini AI with a predefined prompt for consistent evaluation.  
4. **Candidate Ranking:** Gemini AI returns structured JSON results and a score out of 100, stored in Firestore.  
5. **Profile Display:** Frontend displays ranked candidates with detailed profiles.  
6. **Interview Invitations:** Recruiters select candidates for interviews; EmailJS sends invitation emails with meeting links.  
7. **Online Interviews:** Candidates join interviews through the platform’s integrated video system, completing the recruitment workflow.  

---
[![Watch the video](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=dWX1l1hmb2U)

## Contact

For inquiries, feedback, or collaboration:

**Email:** hello@rusiru.dev  

---

