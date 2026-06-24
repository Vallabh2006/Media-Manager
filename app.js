// App State Management
const DEFAULT_STATE = {
    users: [
        { username: 'admin', email: 'admin@cvmu.edu.in', password: 'admin123', role: 'admin', college: 'CVMU', joinDate: '2026-01-10', status: 'approved' },
        { username: 'student', email: 'student@gcet.ac.in', password: 'student123', role: 'student', college: 'GCET', joinDate: '2026-05-15', status: 'approved' },
        { username: 'drpatel', email: 'patel@gcet.ac.in', password: 'faculty123', role: 'faculty', college: 'GCET', joinDate: '2026-03-20', status: 'approved' },
        { username: 'profsmit', email: 'smit@mbit.edu.in', password: 'faculty123', role: 'faculty', college: 'MBIT', joinDate: '2026-06-20', status: 'pending' }
    ],
    resources: [
        {
            id: 'sub-1',
            type: 'subject',
            name: 'Artificial Intelligence for Everyone',
            children: [
                {
                    id: 'unit-1',
                    type: 'unit',
                    name: 'Unit 1: Artificial Intelligence Fundamentals',
                    children: [
                        {
                            id: 'topic-1',
                            type: 'topic',
                            name: 'AI Definition & Timelines',
                            children: [
                                { id: 'res-1', type: 'pdf', name: 'Unit 1 Syllabus & Overview.pdf', size: '1.2 MB', uploader: 'drpatel', date: '2026-06-01', link: '#' },
                                { id: 'res-2', type: 'ppt', name: 'Intro to AI Foundations.pptx', size: '3.4 MB', uploader: 'drpatel', date: '2026-06-02', link: '#' }
                            ]
                        },
                        {
                            id: 'topic-2',
                            type: 'topic',
                            name: 'Turing Test & Philosophy of Mind',
                            children: [
                                { id: 'res-3', type: 'notes', name: 'Turing Test & Searle\'s Room Notes.pdf', size: '450 KB', uploader: 'drpatel', date: '2026-06-03', link: '#' }
                            ]
                        }
                    ]
                },
                {
                    id: 'unit-2',
                    type: 'unit',
                    name: 'Unit 2: Machine Learning Basics',
                    children: [
                        {
                            id: 'topic-3',
                            type: 'topic',
                            name: 'Supervised vs Unsupervised Learning',
                            children: [
                                { id: 'res-4', type: 'pdf', name: 'ML Supervised Models.pdf', size: '2.1 MB', uploader: 'drpatel', date: '2026-06-04', link: '#' },
                                { id: 'res-5', type: 'link', name: 'Clustering Interactive Demo', size: 'Link', uploader: 'drpatel', date: '2026-06-05', link: 'https://scikit-learn.org' }
                            ]
                        }
                    ]
                },
                {
                    id: 'unit-3',
                    type: 'unit',
                    name: 'Unit 3: Generative AI & Prompt Engineering',
                    children: [
                        {
                            id: 'topic-4',
                            type: 'topic',
                            name: 'Prompt Strategies & Large Language Models',
                            children: [
                                { id: 'res-6', type: 'notes', name: 'Prompt Engineering Strategies.pdf', size: '890 KB', uploader: 'drpatel', date: '2026-06-06', link: '#' }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    logs: [
        { time: '2026-06-20 09:12:00', type: 'reg', message: 'New Student registered: student (student@gcet.ac.in)' },
        { time: '2026-06-20 10:05:00', type: 'reg', message: 'New Faculty registered: profsmit (smit@mbit.edu.in) [Status: Pending Approval]' },
        { time: '2026-06-20 14:22:00', type: 'login', message: 'Admin logged in: admin@cvmu.edu.in' },
        { time: '2026-06-21 11:30:00', type: 'upload', message: 'Faculty drpatel uploaded resource: ML Supervised Models.pdf to Supervised vs Unsupervised Learning' },
        { time: '2026-06-21 13:45:00', type: 'structure', message: 'Faculty drpatel added new topic: Prompt Strategies & Large Language Models' }
    ]
};

// Global application state variables
let state = {};
let currentUser = null;
let activeLoginRole = 'student'; // default role selector on login page
let activeSignupRole = 'student'; // default role selector on signup page
let generatedOTP = null;
let selectedUploadFile = null;
let adminChart = null; // Chart.js instance

// Helper functions for LocalStorage Persistence
function loadState() {
    const saved = localStorage.getItem('cvm_ai_portal_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing saved state, resetting.', e);
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    } else {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
    }
    
    const savedUser = localStorage.getItem('cvm_ai_current_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (e) {
            console.error('Error parsing saved current user.', e);
            currentUser = null;
        }
    }
}

function saveState() {
    localStorage.setItem('cvm_ai_portal_state', JSON.stringify(state));
}

// Write to audit log
function addLog(type, message) {
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
    state.logs.unshift({
        time: timeStr,
        type: type,
        message: message
    });
    saveState();
}

// Toast Notifications popup
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';
    if (type === 'warning') iconName = 'alert-circle';
    
    toast.innerHTML = `
        <div class="toast-icon"><i data-lucide="${iconName}"></i></div>
        <div class="toast-message">${message}</div>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    // trigger reflow for css animations
    toast.offsetHeight;
    toast.classList.add('visible');
    
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Helper to determine the view of the current page filename
function getCurrentFileView() {
    const path = window.location.pathname;
    if (path.endsWith('syllabus.html')) return 'syllabus';
    if (path.endsWith('features.html')) return 'features';
    if (path.endsWith('contact.html')) return 'contact';
    if (path.endsWith('login.html')) return 'login';
    if (path.endsWith('signup.html')) return 'signup';
    if (path.endsWith('dashboard.html')) return 'dashboard';
    if (path.endsWith('pending-approval.html')) return 'pending-approval';
    return 'landing';
}

// Router - Single Page Application View Controller / Page Redirect Handler
function showView(viewId) {
    const currentView = getCurrentFileView();
    if (viewId !== currentView) {
        let targetFile = 'index.html';
        if (viewId !== 'landing') {
            targetFile = viewId + '.html';
        }
        window.location.href = targetFile;
        return;
    }

    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });
    
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 50);
    }
    
    const header = document.getElementById('mainHeader');
    const footer = document.getElementById('mainFooter');
    
    // Header & Footer adjustments
    if (viewId === 'dashboard') {
        if (header) header.style.display = 'none'; // Full bleed dashboard layout
        if (footer) footer.style.display = 'none';
    } else {
        if (header) header.style.display = 'flex';
        if (footer) footer.style.display = 'block';
        
        // Adjust navigation links
        const nav = document.getElementById('mainNav');
        const headerButtons = document.getElementById('headerButtons');
        
        // Update active class on nav links
        if (nav) {
            nav.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${viewId}'`)) {
                    link.classList.add('active');
                }
            });
        }
        
        if (currentUser) {
            if (nav) nav.style.display = 'none';
            if (headerButtons) {
                headerButtons.innerHTML = `
                    <button onclick="showView('dashboard')" class="btn btn-primary">Go to Dashboard</button>
                    <button onclick="logout()" class="btn btn-outline">Logout</button>
                `;
            }
        } else {
            if (nav) nav.style.display = 'flex';
            if (headerButtons) {
                headerButtons.innerHTML = `
                    <button onclick="showView('login')" class="btn btn-outline">Login</button>
                    <button onclick="showView('signup')" class="btn btn-primary">Sign Up</button>
                `;
            }
        }
    }
    
    // Specific initialization on view loading
    if (viewId === 'dashboard') {
        initDashboard();
    }
    
    // Refresh icons
    lucide.createIcons();
}


// Role toggle handlers for Login Page
function setLoginRole(role) {
    activeLoginRole = role;
    const btns = document.querySelectorAll('#view-login .role-btn');
    if (btns) btns.forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.getElementById(`login-role-${role}`);
    if (targetBtn) targetBtn.classList.add('active');
}

// Role toggle handlers for Signup Page
function setSignupRole(role) {
    activeSignupRole = role;
    const btns = document.querySelectorAll('#view-signup .role-btn');
    if (btns) btns.forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.getElementById(`signup-role-${role}`);
    if (targetBtn) targetBtn.classList.add('active');
    
    // Toggle OTP elements based on role
    const btnSendOTP = document.getElementById('btnSendOTP');
    const otpContainer = document.getElementById('signupOTPContainer');
    if (role === 'faculty') {
        if (btnSendOTP) btnSendOTP.style.display = 'inline-block';
    } else {
        if (btnSendOTP) btnSendOTP.style.display = 'none';
        if (otpContainer) otpContainer.style.display = 'none';
    }
}


// Landing page click handlers
function handleSyllabusClick(unitId) {
    if (!currentUser) {
        showToast('Please log in to access the syllabus resources.', 'warning');
        showView('login');
    } else {
        showView('dashboard');
    }
}

function handleFeatureClick() {
    if (!currentUser) {
        showToast('Please log in to access portal features.', 'warning');
        showView('login');
    } else {
        showView('dashboard');
    }
}

// Sign Up OTP logic
function sendSignupOTP() {
    const college = document.getElementById('signupCollege').value;
    const collegeVal = document.getElementById('val-signup-college');
    const email = document.getElementById('signupEmail').value.trim();
    const emailVal = document.getElementById('val-signup-email');
    
    let valid = true;
    
    if (!college) {
        collegeVal.textContent = 'Please select your college affiliation.';
        collegeVal.classList.add('visible');
        valid = false;
    } else {
        collegeVal.classList.remove('visible');
    }
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailPattern.test(email)) {
        emailVal.textContent = 'Please enter a valid email address.';
        emailVal.classList.add('visible');
        valid = false;
    } else {
        let expectedDomain = '';
        if (activeSignupRole === 'faculty') {
            expectedDomain = 'cvmu.edu.in';
        } else {
            if (college === 'GCET') expectedDomain = 'gcet.ac.in';
            if (college === 'MBIT') expectedDomain = 'mbit.edu.in';
            if (college === 'ADIT') expectedDomain = 'adit.ac.in';
        }
        
        if (!expectedDomain) {
            emailVal.textContent = 'Please select a college first.';
            emailVal.classList.add('visible');
            valid = false;
        } else if (!email.toLowerCase().endsWith(`@${expectedDomain}`)) {
            emailVal.textContent = `Approved domain for ${activeSignupRole === 'faculty' ? 'Faculty' : college} registration is: @${expectedDomain}`;
            emailVal.classList.add('visible');
            valid = false;
        } else {
            // Check if email already registered
            const exists = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (exists) {
                emailVal.textContent = 'This email address is already registered.';
                emailVal.classList.add('visible');
                valid = false;
            } else {
                emailVal.classList.remove('visible');
            }
        }
    }
    
    if (!valid) return;
    
    // Generate simulated OTP code
    generatedOTP = Math.floor(100000 + Math.random() * 900000);
    
    // Show Toast with OTP code
    showToast(`Verification code sent! Simulated OTP is: ${generatedOTP}`, 'success');
    
    // Show OTP input container
    const otpContainer = document.getElementById('signupOTPContainer');
    otpContainer.style.display = 'block';
    
    // Change Send OTP button text to Resend OTP
    const btnSendOTP = document.getElementById('btnSendOTP');
    btnSendOTP.textContent = 'Resend OTP';
}

// Single step signup submission
function handleSignupSubmit() {
    const college = document.getElementById('signupCollege').value;
    const email = document.getElementById('signupEmail').value.trim();
    const otpInput = document.getElementById('signupOTP').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirmPassword').value;
    
    const collegeVal = document.getElementById('val-signup-college');
    const emailVal = document.getElementById('val-signup-email');
    const otpVal = document.getElementById('val-signup-otp');
    const userVal = document.getElementById('val-signup-username');
    const passVal = document.getElementById('val-signup-password');
    const confVal = document.getElementById('val-signup-confirm');
    
    let valid = true;
    
    // 1. College
    if (!college) {
        collegeVal.textContent = 'Please select your college affiliation.';
        collegeVal.classList.add('visible');
        valid = false;
    } else {
        collegeVal.classList.remove('visible');
    }
    
    // 2. Email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let expectedDomain = '';
    if (activeSignupRole === 'faculty') {
        expectedDomain = 'cvmu.edu.in';
    } else {
        if (college === 'GCET') expectedDomain = 'gcet.ac.in';
        if (college === 'MBIT') expectedDomain = 'mbit.edu.in';
        if (college === 'ADIT') expectedDomain = 'adit.ac.in';
    }
    
    if (!email || !emailPattern.test(email)) {
        emailVal.textContent = 'Please enter a valid email address.';
        emailVal.classList.add('visible');
        valid = false;
    } else if (!expectedDomain) {
        emailVal.textContent = 'Please select college first.';
        emailVal.classList.add('visible');
        valid = false;
    } else if (!email.toLowerCase().endsWith(`@${expectedDomain}`)) {
        emailVal.textContent = `Approved domain for ${activeSignupRole === 'faculty' ? 'Faculty' : college} registration is: @${expectedDomain}`;
        emailVal.classList.add('visible');
        valid = false;
    } else {
        const exists = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            emailVal.textContent = 'This email address is already registered.';
            emailVal.classList.add('visible');
            valid = false;
        } else {
            emailVal.classList.remove('visible');
        }
    }
    
    // 3. OTP Code (Only required for Faculty)
    if (activeSignupRole === 'faculty') {
        if (!generatedOTP) {
            otpVal.textContent = 'Please click Send OTP and enter the code.';
            otpVal.classList.add('visible');
            valid = false;
        } else if (otpInput !== String(generatedOTP)) {
            otpVal.textContent = 'Incorrect OTP code. Please enter the correct code.';
            otpVal.classList.add('visible');
            valid = false;
        } else {
            otpVal.classList.remove('visible');
        }
    } else {
        otpVal.classList.remove('visible');
    }
    
    // 4. Username
    if (!username || username.length < 3) {
        userVal.textContent = 'Username must be at least 3 characters.';
        userVal.classList.add('visible');
        valid = false;
    } else {
        const exists = state.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (exists) {
            userVal.textContent = 'This username is already taken.';
            userVal.classList.add('visible');
            valid = false;
        } else {
            userVal.classList.remove('visible');
        }
    }
    
    // 5. Password
    if (!password || password.length < 6) {
        passVal.textContent = 'Password must be at least 6 characters.';
        passVal.classList.add('visible');
        valid = false;
    } else {
        passVal.classList.remove('visible');
    }
    
    // 6. Confirm Password
    if (password !== confirm) {
        confVal.textContent = 'Passwords do not match.';
        confVal.classList.add('visible');
        valid = false;
    } else {
        confVal.classList.remove('visible');
    }
    
    if (!valid) return;
    
    // Complete signup process
    const now = new Date();
    const joinDate = now.toISOString().substring(0, 10);
    
    // Faculty begins as 'pending', student begins as 'approved'
    const status = activeSignupRole === 'faculty' ? 'pending' : 'approved';
    
    const newUser = {
        username: username,
        email: email,
        password: password,
        role: activeSignupRole,
        college: college,
        joinDate: joinDate,
        status: status
    };
    
    state.users.push(newUser);
    saveState();
    
    addLog('reg', `New Account registered: ${username} (${email}) as ${activeSignupRole}. Status: ${status}`);
    
    if (activeSignupRole === 'faculty') {
        showToast('Application submitted for administrator review.', 'success');
        currentUser = newUser;
        localStorage.setItem('cvm_ai_current_user', JSON.stringify(currentUser));
        showView('pending-approval');
    } else {
        showToast('Registration successful! Please log in.', 'success');
        localStorage.setItem('cvm_ai_signup_fill', JSON.stringify({ username: username, password: password }));
        showView('login');
    }
    
    // Reset forms and OTP state
    document.getElementById('signupForm').reset();
    document.getElementById('signupOTPContainer').style.display = 'none';
    document.getElementById('btnSendOTP').textContent = 'Send OTP';
    generatedOTP = null;
}

// Authentication Actions
function handleLogin(event) {
    event.preventDefault();
    const userVal = document.getElementById('val-login-user');
    const passVal = document.getElementById('val-login-pass');
    userVal.classList.remove('visible');
    passVal.classList.remove('visible');
    
    const inputUser = document.getElementById('loginUsername').value.trim();
    const inputPass = document.getElementById('loginPassword').value;
    
    const matched = state.users.find(u => 
        (u.username.toLowerCase() === inputUser.toLowerCase() || u.email.toLowerCase() === inputUser.toLowerCase())
    );
    
    if (!matched) {
        userVal.textContent = 'Account username or email not found.';
        userVal.classList.add('visible');
        addLog('fail', `Login failed: Non-existent user "${inputUser}"`);
        return;
    }
    
    if (matched.password !== inputPass) {
        passVal.textContent = 'Incorrect password.';
        passVal.classList.add('visible');
        addLog('fail', `Login failed: Incorrect password for "${matched.username}"`);
        return;
    }
    
    // Role matching validation
    if (matched.role !== 'admin' && matched.role !== activeLoginRole) {
        userVal.textContent = `Account found, but role is not "${activeLoginRole.toUpperCase()}". Please switch tabs.`;
        userVal.classList.add('visible');
        addLog('fail', `Login failed: Role mismatch for "${matched.username}" (Selected: ${activeLoginRole}, Actual: ${matched.role})`);
        return;
    }
    
    // Pending approvals check
    if (matched.role === 'faculty' && matched.status === 'pending') {
        currentUser = matched;
        localStorage.setItem('cvm_ai_current_user', JSON.stringify(currentUser));
        showView('pending-approval');
        addLog('login', `Pending Faculty logged in: ${matched.username}`);
        return;
    }
    
    if (matched.role === 'faculty' && matched.status === 'rejected') {
        userVal.textContent = 'Your application has been rejected by the administrator.';
        userVal.classList.add('visible');
        addLog('fail', `Login blocked: Rejected Faculty "${matched.username}"`);
        return;
    }
    
    // Login successful
    currentUser = matched;
    localStorage.setItem('cvm_ai_current_user', JSON.stringify(currentUser));
    addLog('login', `${currentUser.role.toUpperCase()} logged in successfully: ${currentUser.username}`);
    showToast(`Logged in successfully as ${currentUser.username}`, 'success');
    showView('dashboard');
    document.getElementById('loginForm').reset();
}

function logout() {
    if (currentUser) {
        addLog('login', `${currentUser.role.toUpperCase()} logged out: ${currentUser.username}`);
    }
    currentUser = null;
    localStorage.removeItem('cvm_ai_current_user');
    showToast('Logged out successfully.', 'info');
    showView('landing');
}

// Dashboard rendering and controllers
function initDashboard() {
    if (!currentUser) return;
    
    // Update sidebar profile card
    document.getElementById('sidebarAvatar').textContent = currentUser.username.substring(0, 2).toUpperCase();
    document.getElementById('sidebarProfileName').textContent = currentUser.username;
    document.getElementById('sidebarProfileRole').textContent = currentUser.role === 'admin' ? 'System Administrator' : currentUser.role;
    
    // Render sidebar menus based on roles
    const menuContainer = document.getElementById('sidebarMenu');
    menuContainer.innerHTML = '';
    
    if (currentUser.role === 'student') {
        menuContainer.innerHTML = `
            <li class="menu-item active" id="menu-student-home" onclick="setPanel('student-home')">
                <i data-lucide="home"></i><span>Home</span>
            </li>
            <li class="menu-item" id="menu-student-resources" onclick="setPanel('student-resources')">
                <i data-lucide="folder-search"></i><span>Resources</span>
            </li>
        `;
        setPanel('student-home');
    } 
    else if (currentUser.role === 'faculty') {
        menuContainer.innerHTML = `
            <li class="menu-item active" id="menu-faculty-home" onclick="setPanel('faculty-home')">
                <i data-lucide="home"></i><span>Home</span>
            </li>
            <li class="menu-item" id="menu-manage-resources" onclick="setPanel('manage-resources')">
                <i data-lucide="folder-git"></i><span>Manage Resources</span>
            </li>
        `;
        setPanel('faculty-home');
    } 
    else if (currentUser.role === 'admin') {
        menuContainer.innerHTML = `
            <li class="menu-item active" id="menu-admin-home" onclick="setPanel('admin-home')">
                <i data-lucide="home"></i><span>Home</span>
            </li>
            <li class="menu-item" id="menu-manage-resources" onclick="setPanel('manage-resources')">
                <i data-lucide="folder-git"></i><span>Manage Resources</span>
            </li>
            <li class="menu-item" id="menu-faculty-applications" onclick="setPanel('faculty-applications')">
                <i data-lucide="user-check"></i><span>Faculty Applications</span>
            </li>
            <li class="menu-item" id="menu-faculty-list" onclick="setPanel('faculty-list')">
                <i data-lucide="users"></i><span>Faculty List</span>
            </li>
            <li class="menu-item" id="menu-logs" onclick="setPanel('logs')">
                <i data-lucide="database"></i><span>Logs</span>
            </li>
        `;
        setPanel('admin-home');
    }
    
    lucide.createIcons();
}

// Tab/Panel Switcher within Dashboard View
function setPanel(panelId) {
    // Hide all panel sections
    document.querySelectorAll('.panel-section').forEach(el => el.style.display = 'none');
    
    // Show target panel section
    const target = document.getElementById(`panel-${panelId}`);
    if (target) target.style.display = 'block';
    
    // Toggle active classes on sidebar menu items
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(el => el.classList.remove('active'));
    const matchedMenu = document.getElementById(`menu-${panelId}`);
    if (matchedMenu) matchedMenu.classList.add('active');
    
    // Dynamic titles
    const titleEl = document.getElementById('dashboardTitle');
    const subEl = document.getElementById('dashboardSubtitle');
    
    if (panelId === 'student-home') {
        titleEl.textContent = 'Student Workspace';
        subEl.textContent = 'Welcome back! View subject metrics and news highlights.';
        renderStudentHomeMetrics();
    } 
    else if (panelId === 'student-resources') {
        titleEl.textContent = 'Resource Explorer';
        subEl.textContent = 'Browse, search, and download unit files and notes.';
        initStudentResourcesFilters();
        renderStudentResources();
    } 
    else if (panelId === 'faculty-home') {
        titleEl.textContent = 'Faculty Hub';
        subEl.textContent = 'Portal metrics and course assets overview.';
        renderFacultyHomeMetrics();
    } 
    else if (panelId === 'manage-resources') {
        titleEl.textContent = 'Resource Management Structure';
        subEl.textContent = 'Modify syllabus outlines, add study materials, or delete folders.';
        renderResourcesTree();
    } 
    else if (panelId === 'admin-home') {
        titleEl.textContent = 'Administrator Dashboard';
        subEl.textContent = 'System health metrics, application queues, and logs summaries.';
        renderAdminHomeMetrics();
        initAdminCharts();
    } 
    else if (panelId === 'faculty-applications') {
        titleEl.textContent = 'Registration Applications';
        subEl.textContent = 'Authorize or reject pending faculty user accounts.';
        renderFacultyApplications();
    } 
    else if (panelId === 'faculty-list') {
        titleEl.textContent = 'Faculty Directory';
        subEl.textContent = 'View and query registered faculty listings.';
        renderFacultyList();
    } 
    else if (panelId === 'logs') {
        titleEl.textContent = 'System Audit Logs';
        subEl.textContent = 'Detailed transaction histories for system administrative activities.';
        renderLogs();
    }
    
    lucide.createIcons();
}

// Count helper utilities
function countTotalResources() {
    let count = 0;
    function traverse(node) {
        if (node.type === 'topic' && node.children) {
            count += node.children.length;
        } else if (node.children) {
            node.children.forEach(traverse);
        }
    }
    state.resources.forEach(traverse);
    return count;
}

function countTotalUnits() {
    let count = 0;
    function traverse(node) {
        if (node.type === 'unit') {
            count++;
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
    }
    state.resources.forEach(traverse);
    return count;
}

function countTotalTopics() {
    let count = 0;
    function traverse(node) {
        if (node.type === 'topic') {
            count++;
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
    }
    state.resources.forEach(traverse);
    return count;
}

// Student Dashboard Operations
function renderStudentHomeMetrics() {
    document.getElementById('card-student-resources').textContent = countTotalResources();
    document.getElementById('card-student-units').textContent = countTotalUnits();
}

function initStudentResourcesFilters() {
    const filterUnit = document.getElementById('filterUnit');
    filterUnit.innerHTML = '<option value="">All Units</option>';
    
    function traverse(node) {
        if (node.type === 'unit') {
            filterUnit.innerHTML += `<option value="${node.id}">${node.name}</option>`;
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
    }
    state.resources.forEach(traverse);
    
    // Reset topic filter
    const filterTopic = document.getElementById('filterTopic');
    filterTopic.innerHTML = '<option value="">All Topics</option>';
}

function filterStudentResources() {
    const unitSelect = document.getElementById('filterUnit');
    const topicSelect = document.getElementById('filterTopic');
    
    // If unit changed, dynamically populate topics
    const selectedUnitId = unitSelect.value;
    
    // Save current topic selection
    const previousTopicVal = topicSelect.value;
    
    topicSelect.innerHTML = '<option value="">All Topics</option>';
    if (selectedUnitId) {
        let foundUnit = null;
        function findUnit(node) {
            if (node.id === selectedUnitId) foundUnit = node;
            else if (node.children) node.children.forEach(findUnit);
        }
        state.resources.forEach(findUnit);
        
        if (foundUnit && foundUnit.children) {
            foundUnit.children.forEach(topic => {
                topicSelect.innerHTML += `<option value="${topic.id}">${topic.name}</option>`;
            });
        }
        // Restore topic filter if still valid
        topicSelect.value = previousTopicVal;
    }
    
    renderStudentResources();
}

function renderStudentResources() {
    const searchVal = document.getElementById('resourceSearch').value.toLowerCase();
    const unitId = document.getElementById('filterUnit').value;
    const topicId = document.getElementById('filterTopic').value;
    const container = document.getElementById('studentResourcesGrid');
    
    container.innerHTML = '';
    
    // Flatten resources with path names
    const list = [];
    function traverse(node, path = { subject: '', unit: '', topic: '' }) {
        let currentPath = { ...path };
        if (node.type === 'subject') currentPath.subject = node.name;
        if (node.type === 'unit') currentPath.unit = node.name;
        if (node.type === 'topic') currentPath.topic = node.name;
        
        if (node.type === 'topic' && node.children) {
            node.children.forEach(res => {
                list.push({
                    ...res,
                    subjectId: path.subjectId,
                    unitId: path.unitId,
                    topicId: node.id,
                    path: currentPath
                });
            });
        } else if (node.children) {
            node.children.forEach(child => {
                traverse(child, {
                    ...currentPath,
                    subjectId: node.type === 'subject' ? node.id : path.subjectId,
                    unitId: node.type === 'unit' ? node.id : path.unitId
                });
            });
        }
    }
    state.resources.forEach(node => traverse(node));
    
    // Filter matches
    const filtered = list.filter(res => {
        // unit match
        if (unitId && res.unitId !== unitId) return false;
        // topic match
        if (topicId && res.topicId !== topicId) return false;
        // text search matches title, topic name, or uploader
        if (searchVal) {
            const matchesTitle = res.name.toLowerCase().includes(searchVal);
            const matchesTopic = res.path.topic.toLowerCase().includes(searchVal);
            const matchesUploader = res.uploader.toLowerCase().includes(searchVal);
            const matchesUnit = res.path.unit.toLowerCase().includes(searchVal);
            if (!matchesTitle && !matchesTopic && !matchesUploader && !matchesUnit) return false;
        }
        return true;
    });
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i data-lucide="folder-open" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No resources found matching the specified query filters.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    filtered.forEach(res => {
        const typeClass = res.type; // pdf, ppt, notes, link
        let label = res.type.toUpperCase();
        
        container.innerHTML += `
            <div class="resource-card">
                <div class="resource-type-icon ${typeClass}">
                    <i data-lucide="${getFileIcon(res.type)}"></i>
                </div>
                <div class="resource-card-meta">${res.path.unit.split(':')[0]} • ${res.path.topic}</div>
                <h4 class="resource-card-title">${res.name}</h4>
                <div class="resource-card-info">
                    <span>Size: ${res.size}</span>
                    <a onclick="downloadResource('${res.name}', '${res.link}')" class="download-link-btn">
                        <i data-lucide="${res.type === 'link' ? 'external-link' : 'download'}"></i> 
                        <span>${res.type === 'link' ? 'Open' : 'Download'}</span>
                    </a>
                </div>
            </div>
        `;
    });
    
    lucide.createIcons();
}

function getFileIcon(type) {
    if (type === 'pdf') return 'file-text';
    if (type === 'ppt') return 'presentation';
    if (type === 'notes') return 'book-open';
    if (type === 'link') return 'link-2';
    return 'file';
}

function downloadResource(name, link) {
    if (link && link !== '#') {
        window.open(link, '_blank');
        addLog('download', `Student ${currentUser.username} opened link: ${name}`);
        showToast(`Opening Link: ${name}`, 'success');
    } else {
        addLog('download', `Student ${currentUser.username} downloaded: ${name}`);
        showToast(`Downloading file: ${name}...`, 'success');
    }
}

// Faculty Operations
function renderFacultyHomeMetrics() {
    let uploadedCount = 0;
    function traverse(node) {
        if (node.type === 'topic' && node.children) {
            node.children.forEach(res => {
                if (res.uploader === currentUser.username) uploadedCount++;
            });
        } else if (node.children) {
            node.children.forEach(traverse);
        }
    }
    state.resources.forEach(traverse);
    
    document.getElementById('card-faculty-resources').textContent = uploadedCount;
    document.getElementById('card-faculty-topics').textContent = countTotalTopics();
    document.getElementById('card-faculty-units').textContent = countTotalUnits();
}

// Manage Resources Tree renderer (Faculty & Admin)
function renderResourcesTree() {
    const root = document.getElementById('resourcesTreeRoot');
    root.innerHTML = '';
    
    if (state.resources.length === 0) {
        root.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                No subjects defined yet. Click "Add Subject" to begin.
            </div>
        `;
        return;
    }
    
    state.resources.forEach(subject => {
        root.appendChild(createTreeNodeElement(subject));
    });
    
    lucide.createIcons();
}

function createTreeNodeElement(node) {
    const el = document.createElement('div');
    el.className = 'tree-node';
    el.id = `node-${node.id}`;
    
    let icon = 'folder';
    if (node.type === 'subject') icon = 'book';
    if (node.type === 'unit') icon = 'layers';
    if (node.type === 'topic') icon = 'hash';
    
    // Render child nodes count
    let countBadge = '';
    if (node.children && node.type !== 'topic') {
        countBadge = `<span style="font-size: 0.75rem; background-color: var(--light-blue); color: var(--secondary); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 700;">${node.children.length}</span>`;
    } else if (node.type === 'topic' && node.children) {
        countBadge = `<span style="font-size: 0.75rem; background-color: #E2E8F0; color: var(--text-secondary); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 700;">${node.children.length} Files</span>`;
    }
    
    // Actions based on permissions and Node Type
    let actionButtons = '';
    if (node.type === 'subject') {
        actionButtons += `
            <button class="tree-action-btn add" onclick="event.stopPropagation(); openAddNodeModal('unit', '${node.id}')">
                <i data-lucide="plus"></i> Unit
            </button>
            <button class="tree-action-btn delete" onclick="event.stopPropagation(); deleteNode('${node.id}', 'subject')">
                <i data-lucide="trash-2"></i>
            </button>
        `;
    } 
    else if (node.type === 'unit') {
        actionButtons += `
            <button class="tree-action-btn add" onclick="event.stopPropagation(); openAddNodeModal('topic', '${node.id}')">
                <i data-lucide="plus"></i> Topic
            </button>
            <button class="tree-action-btn delete" onclick="event.stopPropagation(); deleteNode('${node.id}', 'unit')">
                <i data-lucide="trash-2"></i>
            </button>
        `;
    } 
    else if (node.type === 'topic') {
        actionButtons += `
            <button class="tree-action-btn add" onclick="event.stopPropagation(); openUploadModal('${node.id}')">
                <i data-lucide="upload-cloud"></i> Upload
            </button>
            <button class="tree-action-btn delete" onclick="event.stopPropagation(); deleteNode('${node.id}', 'topic')">
                <i data-lucide="trash-2"></i>
            </button>
        `;
    }
    
    el.innerHTML = `
        <div class="tree-node-header" onclick="toggleTreeNode('${node.id}')">
            <div class="tree-node-title-wrap" id="wrap-${node.id}">
                <i data-lucide="chevron-right" class="chevron"></i>
                <i data-lucide="${icon}"></i>
                <span>${node.name}</span>
                ${countBadge}
            </div>
            <div class="tree-node-actions">
                ${actionButtons}
            </div>
        </div>
        <div class="tree-node-content" id="content-${node.id}">
            <!-- Children elements -->
        </div>
    `;
    
    // Recursively append children
    const contentArea = el.querySelector(`#content-${node.id}`);
    if (node.children && node.children.length > 0) {
        if (node.type === 'topic') {
            // Render files list for topic child node
            node.children.forEach(res => {
                const fileEl = document.createElement('div');
                fileEl.style.display = 'flex';
                fileEl.style.justifyContent = 'space-between';
                fileEl.style.alignItems = 'center';
                fileEl.style.padding = '0.5rem 1rem';
                fileEl.style.borderBottom = '1px solid #F1F5F9';
                fileEl.style.fontSize = '0.85rem';
                
                fileEl.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary);">
                        <i data-lucide="${getFileIcon(res.type)}" style="width: 16px; height: 16px;"></i>
                        <span><b>[${res.type.toUpperCase()}]</b> ${res.name} (${res.size})</span>
                        <span style="font-size:0.75rem; color:#94A3B8;">by ${res.uploader}</span>
                    </div>
                    <button class="tree-action-btn delete" style="padding: 0.15rem 0.35rem;" onclick="deleteResourceFile('${node.id}', '${res.id}')">
                        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                    </button>
                `;
                contentArea.appendChild(fileEl);
            });
        } else {
            node.children.forEach(child => {
                contentArea.appendChild(createTreeNodeElement(child));
            });
        }
    } else {
        contentArea.innerHTML = `
            <div style="padding: 0.5rem 1rem; font-size: 0.8rem; color: var(--text-secondary); font-style: italic;">
                Empty
            </div>
        `;
    }
    
    return el;
}

function toggleTreeNode(nodeId) {
    const wrap = document.getElementById(`wrap-${nodeId}`);
    const content = document.getElementById(`content-${nodeId}`);
    
    if (wrap && content) {
        wrap.classList.toggle('expanded');
        content.classList.toggle('expanded');
    }
}

// Adding Subjects/Units/Topics
function openAddNodeModal(type, parentId) {
    document.getElementById('addNodeType').value = type;
    document.getElementById('addNodeParentId').value = parentId;
    
    const title = document.getElementById('addNodeModalTitle');
    const label = document.getElementById('addNodeLabel');
    const input = document.getElementById('addNodeName');
    
    input.value = '';
    
    if (type === 'subject') {
        title.textContent = 'Add Course Subject';
        label.textContent = 'Subject Title';
        input.placeholder = 'e.g. Artificial Intelligence for Everyone';
    } 
    else if (type === 'unit') {
        title.textContent = 'Add Course Unit';
        label.textContent = 'Unit Title';
        input.placeholder = 'e.g. Unit 4: Natural Language Processing';
    } 
    else if (type === 'topic') {
        title.textContent = 'Add Unit Topic';
        label.textContent = 'Topic Title';
        input.placeholder = 'e.g. Neural Machine Translation';
    }
    
    document.getElementById('addNodeModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function handleAddNodeSubmit(event) {
    event.preventDefault();
    const type = document.getElementById('addNodeType').value;
    const parentId = document.getElementById('addNodeParentId').value;
    const name = document.getElementById('addNodeName').value.trim();
    
    if (!name) return;
    
    const newId = `${type}-${Date.now()}`;
    const newNode = {
        id: newId,
        type: type,
        name: name,
        children: []
    };
    
    if (type === 'subject') {
        state.resources.push(newNode);
        addLog('structure', `${currentUser.role.toUpperCase()} ${currentUser.username} created new Subject: ${name}`);
        showToast(`Subject "${name}" created successfully.`, 'success');
    } 
    else {
        // Find parent and append
        let parentNode = null;
        function findParent(node) {
            if (node.id === parentId) parentNode = node;
            else if (node.children) node.children.forEach(findParent);
        }
        state.resources.forEach(findParent);
        
        if (parentNode) {
            parentNode.children.push(newNode);
            addLog('structure', `${currentUser.role.toUpperCase()} ${currentUser.username} added ${type} "${name}" to "${parentNode.name}"`);
            showToast(`${type.toUpperCase()} added successfully.`, 'success');
        } else {
            showToast('Parent node not found.', 'error');
            return;
        }
    }
    
    saveState();
    closeModal('addNodeModal');
    renderResourcesTree();
}

// Deleting Nodes
function deleteNode(nodeId, type) {
    if (!confirm(`Are you sure you want to delete this ${type} and all of its associated children?`)) {
        return;
    }
    
    let deleted = false;
    let nodeName = '';
    
    if (type === 'subject') {
        const index = state.resources.findIndex(s => s.id === nodeId);
        if (index > -1) {
            nodeName = state.resources[index].name;
            state.resources.splice(index, 1);
            deleted = true;
        }
    } else {
        // Recursive deletion lookup
        function deleteChild(parent) {
            if (!parent.children) return;
            const index = parent.children.findIndex(c => c.id === nodeId);
            if (index > -1) {
                nodeName = parent.children[index].name;
                parent.children.splice(index, 1);
                deleted = true;
                return;
            }
            parent.children.forEach(deleteChild);
        }
        state.resources.forEach(deleteChild);
    }
    
    if (deleted) {
        addLog('structure', `${currentUser.role.toUpperCase()} ${currentUser.username} deleted ${type}: "${nodeName}"`);
        showToast(`${type.toUpperCase()} removed successfully.`, 'success');
        saveState();
        renderResourcesTree();
    } else {
        showToast('Node deletion failed.', 'error');
    }
}

// Upload Resource Files inside Topics
function openUploadModal(topicId) {
    document.getElementById('uploadTopicId').value = topicId;
    document.getElementById('resTitle').value = '';
    document.getElementById('resLink').value = '';
    selectedUploadFile = null;
    
    // Reset drag drop styling text
    const text = document.querySelector('.drag-drop-text');
    text.textContent = 'Drag & drop files here or click to browse';
    
    document.getElementById('uploadModal').classList.add('active');
    toggleUploadLinkInput(false);
    
    // Set default checked option
    document.querySelector('input[name="resType"][value="pdf"]').checked = true;
}

function toggleUploadLinkInput(show) {
    const linkGroup = document.getElementById('resLinkGroup');
    const dragArea = document.getElementById('dragDropArea');
    const submitBtn = document.getElementById('uploadSubmitBtn');
    
    if (show) {
        linkGroup.style.display = 'block';
        dragArea.style.display = 'none';
        document.getElementById('resLink').required = true;
        submitBtn.textContent = 'Add External Link';
    } else {
        linkGroup.style.display = 'none';
        dragArea.style.display = 'block';
        document.getElementById('resLink').required = false;
        submitBtn.textContent = 'Upload File';
    }
}

// Handle selected file details
function handleFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    selectedUploadFile = file;
    const text = document.querySelector('.drag-drop-text');
    text.textContent = `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
    
    // Auto populate title input with file name (without extension)
    const titleInput = document.getElementById('resTitle');
    if (!titleInput.value) {
        titleInput.value = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    }
    
    // Match type checkbox
    const ext = file.name.split('.').pop().toLowerCase();
    let typeVal = 'notes';
    if (ext === 'pdf') typeVal = 'pdf';
    if (['ppt', 'pptx'].includes(ext)) typeVal = 'ppt';
    
    document.querySelector(`input[name="resType"][value="${typeVal}"]`).checked = true;
}

// Drag & drop support
const dragArea = document.getElementById('dragDropArea');
if (dragArea) {
    dragArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragArea.classList.add('dragover');
    });
    
    dragArea.addEventListener('dragleave', () => {
        dragArea.classList.remove('dragover');
    });
    
    dragArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('fileInput').files = files;
            // Trigger selection logic manually
            const mockEvent = { target: { files: files } };
            handleFileSelected(mockEvent);
        }
    });
}

function handleResourceUploadSubmit(event) {
    event.preventDefault();
    const topicId = document.getElementById('uploadTopicId').value;
    const title = document.getElementById('resTitle').value.trim();
    const type = document.querySelector('input[name="resType"]:checked').value;
    const link = document.getElementById('resLink').value.trim();
    
    let fileSize = '1.0 MB';
    let fileUrl = '#';
    
    if (type === 'link') {
        if (!link) {
            showToast('External link URL required.', 'error');
            return;
        }
        fileUrl = link;
        fileSize = 'Link';
    } else {
        if (selectedUploadFile) {
            fileSize = `${(selectedUploadFile.size / (1024 * 1024)).toFixed(1)} MB`;
        }
    }
    
    const now = new Date();
    const dateStr = now.toISOString().substring(0, 10);
    
    const newFile = {
        id: `res-${Date.now()}`,
        type: type,
        name: title + (type === 'link' ? '' : `.${type}`),
        size: fileSize,
        uploader: currentUser.username,
        date: dateStr,
        link: fileUrl
    };
    
    // Find parent topic
    let topicNode = null;
    function findTopic(node) {
        if (node.id === topicId) topicNode = node;
        else if (node.children) node.children.forEach(findTopic);
    }
    state.resources.forEach(findTopic);
    
    if (topicNode) {
        if (!topicNode.children) topicNode.children = [];
        topicNode.children.push(newFile);
        
        addLog('upload', `${currentUser.role.toUpperCase()} ${currentUser.username} uploaded resource: "${newFile.name}" to topic "${topicNode.name}"`);
        showToast('Resource uploaded successfully.', 'success');
        saveState();
    } else {
        showToast('Topic node not found.', 'error');
        return;
    }
    
    closeModal('uploadModal');
    renderResourcesTree();
}

function deleteResourceFile(topicId, fileId) {
    if (!confirm('Are you sure you want to delete this resource file?')) {
        return;
    }
    
    let topicNode = null;
    function findTopic(node) {
        if (node.id === topicId) topicNode = node;
        else if (node.children) node.children.forEach(findTopic);
    }
    state.resources.forEach(findTopic);
    
    if (topicNode && topicNode.children) {
        const index = topicNode.children.findIndex(f => f.id === fileId);
        if (index > -1) {
            const fileName = topicNode.children[index].name;
            topicNode.children.splice(index, 1);
            
            addLog('delete', `${currentUser.role.toUpperCase()} ${currentUser.username} deleted resource: "${fileName}" from topic "${topicNode.name}"`);
            showToast('Resource deleted.', 'success');
            saveState();
            renderResourcesTree();
        }
    }
}

// Admin Operations
function renderAdminHomeMetrics() {
    const studentsCount = state.users.filter(u => u.role === 'student').length;
    const facultyCount = state.users.filter(u => u.role === 'faculty' && u.status === 'approved').length;
    const pendingCount = state.users.filter(u => u.role === 'faculty' && u.status === 'pending').length;
    
    document.getElementById('card-admin-students').textContent = studentsCount;
    document.getElementById('card-admin-faculty').textContent = facultyCount;
    document.getElementById('card-admin-pending').textContent = pendingCount;
    document.getElementById('card-admin-resources').textContent = countTotalResources();
    
    // Quick Applications Queue list inside admin dashboard cards area
    const quickTable = document.querySelector('#adminPendingQuickTable tbody');
    quickTable.innerHTML = '';
    
    const pendingList = state.users.filter(u => u.role === 'faculty' && u.status === 'pending');
    
    if (pendingList.length === 0) {
        quickTable.innerHTML = '<tr><td colspan="3" style="text-align:center; color: var(--text-secondary);">No pending applications</td></tr>';
        return;
    }
    
    pendingList.slice(0, 3).forEach(app => {
        quickTable.innerHTML += `
            <tr>
                <td style="font-weight: 600;">${app.username}</td>
                <td><span class="badge badge-pending">${app.college}</span></td>
                <td>
                    <div class="table-actions">
                        <button onclick="approveFacultyQuick('${app.username}', true)" class="action-btn-circle approve" title="Approve"><i data-lucide="check"></i></button>
                        <button onclick="approveFacultyQuick('${app.username}', false)" class="action-btn-circle reject" title="Reject"><i data-lucide="x"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    lucide.createIcons();
}

function approveFacultyQuick(username, approve) {
    const user = state.users.find(u => u.username === username);
    if (!user) return;
    
    if (approve) {
        user.status = 'approved';
        addLog('approval', `Admin approved faculty credentials: ${user.username} (${user.college})`);
        showToast(`Faculty "${user.username}" approved.`, 'success');
    } else {
        user.status = 'rejected';
        addLog('approval', `Admin rejected faculty credentials: ${user.username} (${user.college})`);
        showToast(`Faculty "${user.username}" credentials rejected.`, 'warning');
    }
    saveState();
    renderAdminHomeMetrics();
    initAdminCharts();
}

// Chart.js admin dashboard configuration
function initAdminCharts() {
    const canvas = document.getElementById('adminChartCanvas');
    if (!canvas) return;
    
    // Extract resource counts by unit
    const labels = [];
    const counts = [];
    
    function traverse(node) {
        if (node.type === 'unit') {
            labels.push(node.name.split(':')[0]);
            
            let filesCount = 0;
            function countFiles(childNode) {
                if (childNode.type === 'topic' && childNode.children) {
                    filesCount += childNode.children.length;
                } else if (childNode.children) {
                    childNode.children.forEach(countFiles);
                }
            }
            node.children.forEach(countFiles);
            counts.push(filesCount);
        } else if (node.children) {
            node.children.forEach(traverse);
        }
    }
    state.resources.forEach(traverse);
    
    if (adminChart) {
        adminChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    adminChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Files Count',
                data: counts,
                backgroundColor: 'rgba(37, 99, 235, 0.85)',
                borderColor: '#1D4ED8',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: '#475569' },
                    grid: { color: '#E2E8F0' }
                },
                x: {
                    ticks: { color: '#475569' },
                    grid: { display: false }
                }
            }
        }
    });
}

// Full Faculty application reviews
function renderFacultyApplications() {
    const tbody = document.querySelector('#adminApplicationsTable tbody');
    tbody.innerHTML = '';
    
    const list = state.users.filter(u => u.role === 'faculty');
    
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No applications processed.</td></tr>';
        return;
    }
    
    list.forEach(app => {
        let statusBadge = `<span class="badge badge-pending">Pending</span>`;
        if (app.status === 'approved') statusBadge = `<span class="badge badge-approved">Approved</span>`;
        if (app.status === 'rejected') statusBadge = `<span class="badge badge-rejected">Rejected</span>`;
        
        let actions = '';
        if (app.status === 'pending') {
            actions = `
                <div class="table-actions">
                    <button onclick="approveFaculty('${app.username}', true)" class="action-btn-circle approve" title="Approve"><i data-lucide="check"></i></button>
                    <button onclick="approveFaculty('${app.username}', false)" class="action-btn-circle reject" title="Reject"><i data-lucide="x"></i></button>
                </div>
            `;
        } else {
            actions = `<span style="font-size:0.8rem; color:var(--text-secondary); font-style:italic;">No Actions Available</span>`;
        }
        
        tbody.innerHTML += `
            <tr>
                <td style="font-weight:600;">${app.username}</td>
                <td>${app.email}</td>
                <td>${app.college}</td>
                <td>${app.joinDate}</td>
                <td>${statusBadge}</td>
                <td>${actions}</td>
            </tr>
        `;
    });
    
    lucide.createIcons();
}

function approveFaculty(username, approve) {
    const user = state.users.find(u => u.username === username);
    if (!user) return;
    
    if (approve) {
        user.status = 'approved';
        addLog('approval', `Admin approved faculty credentials: ${user.username} (${user.college})`);
        showToast(`Faculty application approved.`, 'success');
    } else {
        user.status = 'rejected';
        addLog('approval', `Admin rejected faculty credentials: ${user.username} (${user.college})`);
        showToast(`Faculty credentials rejected.`, 'warning');
    }
    saveState();
    renderFacultyApplications();
}

// Approved Faculty list panel
function renderFacultyList() {
    filterFacultyList();
}

function filterFacultyList() {
    const searchVal = document.getElementById('facultySearch').value.toLowerCase();
    const collegeFilter = document.getElementById('facultyFilterCollege').value;
    const tbody = document.querySelector('#adminFacultyTable tbody');
    
    tbody.innerHTML = '';
    
    const list = state.users.filter(u => u.role === 'faculty' && u.status === 'approved');
    
    const filtered = list.filter(faculty => {
        if (collegeFilter && faculty.college !== collegeFilter) return false;
        if (searchVal) {
            const matchName = faculty.username.toLowerCase().includes(searchVal);
            const matchEmail = faculty.email.toLowerCase().includes(searchVal);
            if (!matchName && !matchEmail) return false;
        }
        return true;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No faculty matching filters found.</td></tr>';
        return;
    }
    
    filtered.forEach(faculty => {
        tbody.innerHTML += `
            <tr>
                <td style="font-weight:600;">${faculty.username}</td>
                <td><span class="badge badge-approved" style="background-color:var(--light-blue); color:var(--secondary);">${faculty.college}</span></td>
                <td>${faculty.email}</td>
                <td>${faculty.joinDate}</td>
                <td><span class="badge badge-approved">Active</span></td>
            </tr>
        `;
    });
}

// Logs view panel
function renderLogs() {
    filterLogs();
}

function filterLogs() {
    const searchVal = document.getElementById('logsSearch').value.toLowerCase();
    const typeFilter = document.getElementById('logsFilterType').value;
    const container = document.getElementById('adminLogsContainer');
    
    container.innerHTML = '';
    
    const filtered = state.logs.filter(log => {
        if (typeFilter && log.type !== typeFilter) return false;
        if (searchVal) {
            const matchMsg = log.message.toLowerCase().includes(searchVal);
            const matchType = log.type.toLowerCase().includes(searchVal);
            if (!matchMsg && !matchType) return false;
        }
        return true;
    });
    
    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-secondary);">No log events matched filters.</div>`;
        return;
    }
    
    filtered.forEach(log => {
        container.innerHTML += `
            <div class="log-item ${log.type}">
                <div class="log-time">${log.time.split(' ')[1]}</div>
                <div class="log-message">
                    <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-right:0.5rem; color:var(--text-secondary);">[${log.type}]</span>
                    ${log.message}
                </div>
            </div>
        `;
    });
}

// Bootstrapping the application
window.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    // Determine the current view based on current filename
    const path = window.location.pathname;
    let currentView = 'landing';
    if (path.endsWith('syllabus.html')) currentView = 'syllabus';
    else if (path.endsWith('features.html')) currentView = 'features';
    else if (path.endsWith('contact.html')) currentView = 'contact';
    else if (path.endsWith('login.html')) currentView = 'login';
    else if (path.endsWith('signup.html')) currentView = 'signup';
    else if (path.endsWith('dashboard.html')) currentView = 'dashboard';
    else if (path.endsWith('pending-approval.html')) currentView = 'pending-approval';
    
    // Routing guards
    if (!currentUser) {
        if (currentView === 'dashboard' || currentView === 'pending-approval') {
            window.location.href = 'login.html';
            return;
        }
    } else {
        if (currentUser.role === 'faculty' && currentUser.status === 'pending') {
            if (currentView !== 'pending-approval') {
                window.location.href = 'pending-approval.html';
                return;
            }
        } else {
            if (currentView === 'pending-approval' || currentView === 'login' || currentView === 'signup') {
                window.location.href = 'dashboard.html';
                return;
            }
        }
    }

    // Set default roles UI if selectors exist on page
    if (document.getElementById('login-role-student')) {
        setLoginRole('student');
    }
    if (document.getElementById('signup-role-student')) {
        setSignupRole('student');
    }
    
    // Handle signup redirect auto-fill
    if (currentView === 'login') {
        const fill = localStorage.getItem('cvm_ai_signup_fill');
        if (fill) {
            try {
                const data = JSON.parse(fill);
                const userInp = document.getElementById('loginUsername');
                const passInp = document.getElementById('loginPassword');
                if (userInp) userInp.value = data.username;
                if (passInp) passInp.value = data.password;
            } catch (e) {
                console.error(e);
            }
            localStorage.removeItem('cvm_ai_signup_fill');
        }
    }
    
    // Render initial page
    showView(currentView);
});
