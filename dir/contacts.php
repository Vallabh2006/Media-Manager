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








        <main class="view-section active" id="view-landing">

            <section class="section">
                <div class="section-header">
                    <span class="hero-badge" style="margin-bottom: 1rem;">Help & Support</span>
                    <h2 class="section-title">Contact Us</h2>
                    <p class="section-subtitle">Have questions or need support? Reach out to the CVM University team.</p>
                </div>
                
                <div class="contact-wrapper" style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem; background-color: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 3rem; box-shadow: var(--shadow-sm);">

                    <div class="contact-info-panel" style="display: flex; flex-direction: column; gap: 2rem;">
                        <div>
                            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--text-dark); margin-bottom: 1rem;">Office Address</h3>
                            <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">
                                CVM University Campus,<br>
                                Near Shastri Maidan, Vallabh Vidyanagar,<br>
                                Gujarat, India - 388120
                            </p>
                        </div>
                        <div>
                            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--text-dark); margin-bottom: 1rem;">Email Support</h3>
                            <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">
                                <a href="mailto:support@cvmu.edu.in" style="color: var(--primary); font-weight: 600; text-decoration: none;">support@cvmu.edu.in</a>
                            </p>
                        </div>
                        <div>
                            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--text-dark); margin-bottom: 1rem;">Associated Colleges</h3>
                            <ul style="color: var(--text-secondary); list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
                                <li><i data-lucide="check" style="width: 16px; height: 16px; color: var(--primary); vertical-align: middle; margin-right: 0.5rem;"></i> GCET Engineering College</li>
                                <li><i data-lucide="check" style="width: 16px; height: 16px; color: var(--primary); vertical-align: middle; margin-right: 0.5rem;"></i> MBIT Institute of Technology</li>
                                <li><i data-lucide="check" style="width: 16px; height: 16px; color: var(--primary); vertical-align: middle; margin-right: 0.5rem;"></i> ADIT Institute of Technology</li>
                            </ul>
                        </div>
                    </div>
                    
                    <form id="contactForm" onsubmit="event.preventDefault(); showToast('Your message has been sent successfully!', 'success'); this.reset();" style="display: flex; flex-direction: column; gap: 1.25rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" placeholder="John Doe" required>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label">Email Address</label>
                                <input type="email" class="form-control" placeholder="john@example.com" required>
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Subject</label>
                            <input type="text" class="form-control" placeholder="Inquiry about portal resources" required>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Message</label>
                            <textarea class="form-control" rows="5" placeholder="Write your message here..." style="resize: vertical; font-family: inherit;" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem; align-self: flex-start; margin-top: 0.5rem; border: none; font-weight: 600;">
                            Send Message <i data-lucide="send" style="width: 16px; height: 16px; margin-left: 0.5rem;"></i>
                        </button>
                    </form>
                </div>
            </section>
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