# AI for Everyone Resource Portal

A centralized, university-grade resource management portal for the subject **"Artificial Intelligence for Everyone"** under **CVM University**. 

This platform connects students and faculty across associated engineering colleges (G H Patel College of Engineering & Technology - GCET, Madhuben & Bhanubhai Patel Institute of Technology - MBIT, and A D Patel Institute of Technology - ADIT) with academic study material and administrative coordination logs.

---

## 🌟 Key Features

### 1. Unified Academic Resources
- **Unit-wise Curricula**: Access course syllabus details across all 6 key educational units of the Artificial Intelligence syllabus.
- **Resource Repository**: Easily download study notes, lecture slide presentations (PPT), and lab exercises filterable by Unit and Topic.

### 2. Multi-Role User Portals
- **Student Access**: Guest/Student accounts can browse units, search and download resources, and view upcoming milestones.
- **Faculty Portal**: Validated faculty users can manage subjects, add topics, delete outdated files, and use drag-and-drop file upload.
- **Admin Dashboard**: System administrators can monitor real-time security logs, view analytics on uploaded materials, and approve/reject pending faculty applications.

### 3. Role-Based Verification & Validation
- **College Domains**: Stricter email checks restrict signup to approved domains (e.g., student accounts require `@gcet.ac.in`, `@mbit.edu.in`, or `@adit.ac.in`).
- **OTP Verification**: Faculty accounts require OTP validation on registration (restricted to `@cvmu.edu.in` addresses).
- **Admin Authorizations**: Newly registered faculty are placed in a **Pending Approval** state and are locked out of the dashboard until a system administrator reviews and approves their credentials.

---

## 🛠️ Architecture & Technical Stack

### Tech Stack
- **Frontend**: Standard Semantic HTML5, Vanilla CSS3 (curated Blue/White theme, custom typography, dynamic cards, hover micro-animations).
- **Icons**: Lucide Icons CDN.
- **Analytics**: Chart.js CDN.
- **State & Router**: Unified controller in [app.js](app.js) handling session persistence (`cvm_ai_current_user`) and local database representation (`cvm_ai_portal_state`) inside the browser's `localStorage`.

### Page Breakdown
The system uses a clean multi-page directory structure coordinated by a central JavaScript state:
- `index.html`: Landing and Home page.
- `syllabus.html`: Course curriculum view.
- `features.html`: Feature overview.
- `contact.html`: College office contacts and email form.
- `login.html`: Unified role login.
- `signup.html`: Single-step role registration.
- `pending-approval.html`: Registration validation screen.
- `dashboard.html`: Student, Faculty, and Admin interfaces.

---

## 🚀 Running Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/Vallabh2006/College-subject-ai.git
   cd College-subject-ai
   ```

2. Start a local HTTP server inside the project root:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Node.js / npx
   npx serve .
   ```

3. Open your browser and navigate to `http://localhost:8000`.

---

## 👥 Contributors

- **CVM University Development Team**
- **Associated Colleges**: GCET, MBIT, ADIT
