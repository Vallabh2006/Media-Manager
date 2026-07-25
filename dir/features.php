<?php
require_once __DIR__ . "/../includes/css.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resource Library</title>
    <link rel="stylesheet" href="../static/css/style.css">
    <link rel="stylesheet" href="../static/css/style.css">

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>

    <link rel="stylesheet" href="../static/css/theme/dark.css" id="theme-var">
    <link rel="stylesheet" href="../static/css/accent/purple.css" id="accent-var">
    <link rel="stylesheet" href="../static/css/font/system.css" id="font-var">

    <script src="../static/js/theme.js"></script>

</head>
<body>

    <div class="toast-container" id="toastContainer"></div>

    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <img src="../media/logo_cvmu.png" alt="CVM University Logo" class="sidebar-logo">
            <button class="sidebar-close" onclick="closeSidebar()" aria-label="Close menu">
                <i data-lucide="x"></i>
            </button>
        </div>

        <div class="stack">
            <button class="btn btn-outline btn-block" onclick="showToast('Join Library — coming soon')">Join Library</button>
            <button class="btn btn-primary btn-block" onclick="showToast('Create Library — coming soon')">Create Library</button>
        </div>

        <p class="sidebar-meta">You're currently in <strong>3</strong> Libraries</p>

        <div class="stack">
            <p class="section-label">Customize</p>
            <button class="btn btn-outline btn-block" onclick="switchTheme()">
                <i data-lucide="moon"></i> Switch Theme
            </button>
            <button class="btn btn-outline btn-block" onclick="switchAccent()">
                <i data-lucide="palette"></i> Switch Accent
            </button>
            <button class="btn btn-outline btn-block" onclick="switchFont()">
                <i data-lucide="type"></i> Switch Font
            </button>
        </div>

        <div class="stack">
            <p class="section-label">Libraries you're in</p>
            <ul class="library-list">
                <li>
                    <img src="../media/logo_gcet.png" alt="GCET">
                    <span>GCET Library</span>
                </li>
                <li>
                    <img src="../media/logo_adit.png" alt="ADIT">
                    <span>ADIT Library</span>
                </li>
                <li>
                    <img src="../media/logo_mbit.png" alt="MBIT">
                    <span>MBIT Library</span>
                </li>
            </ul>
        </div>
    </aside>

    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

    <div class="app-container" id="appContainer">

        <header id="mainHeader">
            <nav class="main-nav" id="mainNav">
                <div class="nav-left">
                    <button class="sidebar-toggle" onclick="openSidebar()" aria-label="Open menu">
                        <i data-lucide="menu"></i>
                    </button>
                    <button onclick="showView('index.php')">Home</button>
                    <button onclick="showView('library.php')">Library</button>
                    <button onclick="showView('contacts.php')">Contact</button>
                </div>

                <button onclick="showView('login.html')" class="nav-signin">Sign in</button>
            </nav>
        </header>








        <main class="view-section" id="view-features">
            <section class="section" id="features">
                <div class="section-header">
                    <span class="hero-badge" style="margin-bottom: 1rem;">Platform Capabilities</span>
                    <h2 class="section-title">Key Portal Features</h2>
                    <p class="section-subtitle">A professional portal designed for fluid university-wide access.</p>
                </div>
                <div class="features-grid">
                    <div class="feature-item" onclick="handleFeatureClick()">
                        <div class="feature-icon-wrapper">
                            <i data-lucide="folder-git"></i>
                        </div>
                        <h3 class="feature-title">Unit-wise Resources</h3>
                        <p class="feature-desc">Perfectly structured syllabi, notes, slide presentations, and links.</p>
                    </div>
                    <div class="feature-item" onclick="handleFeatureClick()">
                        <div class="feature-icon-wrapper">
                            <i data-lucide="users"></i>
                        </div>
                        <h3 class="feature-title">Faculty Management</h3>
                        <p class="feature-desc">Drag-and-drop file upload, content controls, and metadata updates.</p>
                    </div>
                    <div class="feature-item" onclick="handleFeatureClick()">
                        <div class="feature-icon-wrapper">
                            <i data-lucide="lock"></i>
                        </div>
                        <h3 class="feature-title">Secure Authentication</h3>
                        <p class="feature-desc">Secure logins with validation matching college domains.</p>
                    </div>
                    <div class="feature-item" onclick="handleFeatureClick()">
                        <div class="feature-icon-wrapper">
                            <i data-lucide="bar-chart-2"></i>
                        </div>
                        <h3 class="feature-title">College Analytics</h3>
                        <p class="feature-desc">Detailed logs and data tracking for administrators.</p>
                    </div>
                </div>
            </section>
        </main>








        </main>

        <footer class="main-footer" id="mainFooter">
            <div class="footer-grid">

                <div class="footer-col footer-about">
                    <h4>About</h4>
                    <p>A centralized resource portal built for the "Artificial Intelligence for Everyone" course at CVM University, serving GCET, ADIT, and MBIT students.</p>
                </div>

                <div class="footer-col footer-links">
                    <h4>Contacts</h4>
                    <ul class="plain-list">
                        <li><a href="mailto:support@cvmu.edu.in">support@cvmu.edu.in</a></li>
                        <li><a href="#">Faculty of Technology, CVM University</a></li>
                    </ul>
                </div>

                <div class="footer-col footer-legal">
                    <h4>Legal</h4>
                    <ul class="plain-list">
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Security Policy</a></li>
                    </ul>
                </div>

            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 CVM University. All rights reserved.</p>
            </div>
        </footer>

    </div>

    <script src="../static/js/app.js"></script>
    <script>

        if (window.lucide) lucide.createIcons();

        function openSidebar() {
            document.getElementById('sidebar').classList.add('open');
            document.getElementById('sidebarOverlay').classList.add('visible');
            document.getElementById('appContainer').classList.add('blurred');
            document.body.classList.add('no-scroll');
        }
        function closeSidebar() {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebarOverlay').classList.remove('visible');
            document.getElementById('appContainer').classList.remove('blurred');
            document.body.classList.remove('no-scroll');
        }

        function showToast(message) {
            if (window.toast) { window.toast(message); return; }
            console.log('[placeholder]', message);
        }
    </script>
</body>
</html>