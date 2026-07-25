# Media Manager

A web-based media and resource management platform designed to help students and faculty create, manage, and share study material through collaborative libraries.

Users can create their own libraries to organize and share educational resources, or join existing libraries created by other users to access their shared study materials. The platform also provides role-based authentication for administrators, faculty members, and students, along with email verification for account security.

----------

## Key Features

### 1. Library-Based Resource Sharing

-   **Create Libraries**: Users can create libraries to organize and share study materials.
    
-   **Join Libraries**: Students and faculty can join existing libraries to access shared resources.
    
-   **Shared Study Material**: Libraries provide a centralized space for storing and accessing educational content.
    
-   **Library Management**: Library owners and authorized users can manage the content available within their libraries.
    
-   **Multiple Libraries**: Users can be members of multiple libraries at the same time.
    

### 2. Role-Based Authentication

The platform supports separate access levels for different types of users:

-   **Student Login**: Students can join libraries and access study materials shared with them.
    
-   **Faculty Login**: Faculty members can create and manage libraries and share educational resources with their members.
    
-   **Admin Login**: Administrators can manage the platform, monitor users, and perform administrative operations.
    

### 3. Email Verification

The authentication system includes email verification to help ensure that registered accounts belong to valid users.

The verification system is intended to:

-   Confirm user email addresses during registration.
    
-   Improve account security.
    
-   Reduce invalid or unauthorized registrations.
    
-   Support secure account activation workflows.
    

### 4. Appearance Customization

The platform provides multiple customization options that allow users to personalize the appearance of the application.

#### Themes

Available themes include:

-   Light
    
-   Dark
    
-   Night
    
-   Mint
    

#### Accent Colors

Users can customize the interface accent color with options including:

-   Red
    
-   Yellow
    
-   Blue
    
-   Green
    
-   Purple
    
-   Lime
    
-   Orange
    
-   Black
    
-   White
    

#### Fonts

The platform supports multiple font options that can be switched dynamically. Additional fonts can be added through the font-specific CSS files in the project.

----------

## Architecture & Technical Stack

### Tech Stack

-   **Backend**: PHP
    
-   **Frontend**: HTML5, CSS3, JavaScript
    
-   **Database**: Configured through the PHP database connection layer
    
-   **Icons**: Lucide Icons
    
-   **Charts**: Chart.js
    
-   **Authentication**: Role-based login system with email verification
    
-   **Customization**: CSS-based themes, accent colors, and fonts
    

----------

## Project Structure

```text
Media Manager/
│
├── README.md
│
├── dir/
│   ├── contacts.php
│   ├── features.php
│   ├── index.php
│   ├── library.php
│   ├── login.html
│   └── signin.html
│
├── includes/
│   ├── css.php
│   └── db.php
│
├── logs/
│   └── Library.log
│
├── media/
│   └── # Images and other media assets
│
└── static/
    │
    ├── css/
    │   ├── font/
    │   │   ├── mono.css
    │   │   ├── comic.css
    │   │   └── ...
    │   │
    │   ├── accent/
    │   │   ├── red.css
    │   │   ├── yellow.css
    │   │   ├── blue.css
    │   │   ├── green.css
    │   │   ├── purple.css
    │   │   ├── lime.css
    │   │   ├── orange.css
    │   │   ├── black.css
    │   │   └── white.css
    │   │
    │   ├── theme/
    │   │   ├── light.css
    │   │   ├── dark.css
    │   │   ├── night.css
    │   │   └── mint.css
    │   │
    │   └── style.css
    │
    └── js/
        ├── app.js
        └── themes.js

```

----------

## Directory Overview

### `dir/`

Contains the main application pages.

-   `index.php`: Main landing page.
    
-   `contacts.php`: Contact and support page.
    
-   `features.php`: Overview of platform features.
    
-   `library.php`: Library interface for viewing and managing shared resources.
    
-   `login.html`: User login interface.
    
-   `signin.html`: User registration and account creation interface.
    

### `includes/`

Contains shared PHP components used throughout the application.

-   `css.php`: Handles shared CSS and appearance-related resources.
    
-   `db.php`: Handles the database connection and configuration.
    

### `logs/`

Contains application logs and activity records.

-   `Library.log`: Stores library-related application events and logging information.
    

### `media/`

Contains images and other media assets used by the application.

### `static/css/`

Contains the application's styling system.

-   `style.css`: Main application stylesheet.
    
-   `font/`: Font-specific stylesheets.
    
-   `accent/`: Accent color stylesheets.
    
-   `theme/`: Theme stylesheets.
    

The appearance system is designed to separate the base application styling from customizable themes, colors, and fonts.

### `static/js/`

Contains JavaScript functionality.

-   `app.js`: Main application logic and client-side functionality.
    
-   `themes.js`: Handles theme, accent, and font customization.
    

----------

## Appearance System

The appearance system is divided into three independent customization layers:

```text
Theme
  +
Accent
  +
Font
  =
Personalized Interface

```

For example, a user can combine:

```text
Theme: Dark
Accent: Purple
Font: Mono

```

or:

```text
Theme: Mint
Accent: Green
Font: Comic

```

This modular structure makes it possible to add new themes, colors, and fonts without modifying the main application stylesheet.

----------

## User Roles

### Student

Students can:

-   Create an account.
    
-   Verify their email address.
    
-   Log in to the platform.
    
-   Join available libraries.
    
-   View study materials shared by library owners.
    
-   Access resources from libraries they have joined.
    
-   Customize their interface appearance.
    

### Faculty

Faculty members can:

-   Create an account.
    
-   Verify their email address.
    
-   Log in as faculty.
    
-   Create and manage libraries.
    
-   Share study materials with library members.
    
-   Join other libraries where permitted.
    
-   Access resources shared through joined libraries.
    
-   Customize their interface appearance.
    

### Administrator

Administrators have elevated access to platform management functionality.

Depending on the implemented permissions, administrators can:

-   Manage user accounts.
    
-   Monitor platform activity.
    
-   Manage libraries.
    
-   Review system logs.
    
-   Perform administrative operations.
    
-   Manage platform-level resources and settings.
    

----------

## Library Workflow

The core platform workflow is based around libraries:

```text
User
  │
  ├── Create a Library
  │       │
  │       ├── Add Study Materials
  │       └── Share with Members
  │
  └── Join an Existing Library
          │
          └── View Shared Study Materials

```

A user can participate in multiple libraries, allowing study materials to be organized by subjects, courses, departments, classes, or other categories.

----------

## Development Notes

The project is structured to keep application logic, reusable PHP components, styling, and JavaScript functionality separated.

The CSS system is intentionally modular:

```text
style.css
    +
theme/*.css
    +
accent/*.css
    +
font/*.css

```

This allows the application to dynamically switch visual styles while keeping the core layout and component styling in a central stylesheet.

The PHP pages handle server-side functionality, while the HTML pages provide the authentication interfaces and client-side presentation.

----------

## Disclaimer

This project is an independent software project and is **not affiliated with, endorsed by, sponsored by, or officially associated with CVM University, G H Patel College of Engineering & Technology (GCET), or any other educational institution mentioned in development or testing contexts**.

Any references to educational institutions, students, faculty, or study materials are for demonstration, development, or organizational purposes only.

----------
## License

This project is licensed under the MIT License.

Copyright (c) 2026 Vallabh Mehrotra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.