# Bharath's Portfolio

A responsive personal portfolio with a separate content-management backend. The frontend is built with React and Vite; the API uses Node.js, Express, and MongoDB. A protected admin dashboard lets the portfolio owner update the content shown on the public website without changing React components for every content edit.

**Live website:** [pbharathportfolio.netlify.app](https://pbharathportfolio.netlify.app/)

> This README describes the current implementation in this repository. It can also serve as a guide for building a similar portfolio, but you will need your own content, service accounts, credentials, deployment configuration, and branding.

## Table of contents

- [Project overview](#project-overview)
- [What visitors can do](#what-visitors-can-do)
- [How the admin dashboard works](#how-the-admin-dashboard-works)
- [Architecture and data flow](#architecture-and-data-flow)
- [Data models](#data-models)
- [Media storage and uploads](#media-storage-and-uploads)
- [API reference](#api-reference)
- [Technology choices](#technology-choices)
- [Project structure](#project-structure)
- [Run the project locally](#run-the-project-locally)
- [Build and quality checks](#build-and-quality-checks)
- [Deployment guide](#deployment-guide)
- [Security notes](#security-notes)

## Project overview

The site has two cooperating applications:

1. **The public frontend** renders the portfolio and requests editable content from the backend API.
2. **The backend and admin experience** provide authenticated content-management screens, API routes, database persistence, and media uploads.

Portfolio information is kept separate from presentation. For example, the Home page requests its role titles and location from the API, while the Skills page requests the current skill records. An admin can update those records in the dashboard; the public frontend displays the saved data the next time it loads it.

This approach is useful when portfolio content changes more often than the site's design. Content edits can be made through forms instead of requiring a code change and a frontend redeployment for every update.

## What visitors can do

The frontend uses client-side routes and lazy-loads the public pages. The router uses hash-based URLs, so the admin page is reached at `/#/admin`.

### Home

The Home page combines the portfolio introduction with animated role titles, location, experience years, and live counts for projects and skills.

- Home settings are requested from `GET /api/settings/home`.
- Project and skill counts are calculated from the public project and skill API responses.
- Role titles rotate automatically; Framer Motion animates the text transition.
- The hero also includes navigation to the Contact and Projects pages and a decorative animated canvas.

The owner can change the role titles, location, experience years, and displayed name in **Admin → Home**.

### About

The About page requests profile data from `GET /api/about` and the resume link from `GET /api/settings/resume`.

The page can display:

- The profile name, professional title, and profile image.
- Multiple biography paragraphs.
- Reorderable information cards with a label and value.
- A resume link when a resume URL has been configured.

Text wrapped in a single pair of asterisks is highlighted in the page's accent color. The About information and profile image can be changed through **Admin → About**.

### Skills

The Skills page requests the skill collection from `GET /api/skills` and displays each skill using its name, order, icon identifier, and color.

Skill logos are requested as SVGs from Iconify's Simple Icons collection. The admin form accepts common names (for example, `react`, `mysql`, or `tailwind`) and the frontend maps known aliases to Simple Icons identifiers. A full identifier such as `simple-icons:react` can also be stored. The skill icon component uses the chosen color when rendering the SVG and falls back to a simple placeholder if an icon cannot be loaded.

The dashboard's **Admin → Skills** section lets the owner create, edit, remove, and order skill records.

### Experience

The Experience page requests records from `GET /api/experiences`. Entries are ordered using their configured display order and can include:

- Company, role, period, and employment type.
- A list of related technologies or skills.
- Highlight statements describing the work.

An admin can create, edit, remove, and order records in **Admin → Experience**. Skills are entered as a comma-separated list in the form, and highlights are entered one per line.

### Projects

The Projects page requests published records from `GET /api/projects`. The page presents the selected project with its image, description, technology list, and available links. Visitors can move between projects using the carousel controls, pagination indicators, or touch/drag gestures on supported devices.

An admin can create, edit, remove, publish/unpublish, and order projects in **Admin → Projects**. Project records can include a title, category, description, technologies, live and frontend links, and image. When an image is selected in the form, the dashboard uploads it before saving the project record.

### Contact

The Contact page displays the portfolio owner's contact and social links and provides a message form. The form submits through EmailJS using the configured service and template. Contact submissions do not pass through the portfolio's Express API.

### Responsive interface and metadata

The interface is styled primarily with Tailwind CSS and custom CSS. Shared components provide navigation, back navigation, branding, and confirmation dialogs. Framer Motion is used for selected transitions and carousel interactions. Page-specific titles and descriptions are defined in the SEO module; `public/robots.txt` and `public/sitemap.xml` support search-engine discovery.

## How the admin dashboard works

Open `/#/admin` on the deployed site or local frontend to use the admin login. After a successful login, the dashboard provides an overview and separate management areas for Home, About, Resume, Skills, Experience, and Projects.

### Login and session

1. The admin submits a username and password to `POST /api/auth/login`.
2. The backend checks the username and compares the submitted password with the configured bcrypt password hash.
3. If the credentials match, the backend issues a signed JWT with an admin role and a two-hour expiry.
4. The frontend keeps the token in browser session storage and includes it in the `Authorization` header for protected API requests.
5. Backend middleware verifies the token and role before allowing admin changes or uploads.

The login route is limited to five attempts per IP during a 15-minute window. Logging out removes the token from session storage. A saved session is checked against the API when the admin page loads.

### Dashboard overview

The overview displays counts based on the public skills, experience, and projects endpoints. The navigation is designed to work on desktop and smaller screens, with a horizontally scrollable tab bar on mobile.

### Home management

The Home form manages:

- One or more rotating role titles.
- Location.
- Years of experience.
- The name displayed in the home hero and terminal-style panel.

The form checks that required values are present and that experience years are a whole number before saving. The backend stores these values under the shared global site settings record.

### About management

The About form manages the name, professional title, profile image, biography paragraphs, and information cards. Paragraphs and cards can be added, removed, and reordered before saving.

When a new profile image is selected, the dashboard uploads the image to the backend first. After Cloudinary returns a secure URL, the form saves the content and URL to the About record in MongoDB.

### Skill management

Each skill record has a display name, icon key, color, and order. The form shows an icon preview, normalizes common icon names to known Simple Icons identifiers, and lets the owner create, edit, or delete entries. The public Skills page reads the saved list from the API.

### Experience management

Each experience record has a company, role, period, type, skills, highlights, and display order. The form converts comma-separated skills and line-separated highlights into arrays before sending them to the backend.

### Project management

Project records can be created, edited, deleted, reordered, and marked published or unpublished. The form captures a title, category, description, technologies, available project links, image, and display order.

For a newly selected image, the dashboard sends a multipart upload request to the protected upload API. It then saves the returned Cloudinary URL together with the other project fields in MongoDB. Unpublished projects remain manageable in the admin area but are omitted from the public Projects endpoint.

### Resume management

The Resume area lets the owner upload a PDF and set the URL used by the public portfolio. The upload is checked in the frontend and again by the backend. After Cloudinary returns a URL and public ID, the dashboard saves those values in the global site settings record.

## Architecture and data flow

```text
Visitor browser
    │
    ├── React pages ── public GET requests ──┐
    │                                        │
    └── Admin forms ── login / protected API ┤
                                             ▼
                                    Express REST API
                                      │          │
                                      ▼          ▼
                                  MongoDB     Cloudinary
                               content and   uploaded images
                                settings       and resume
```

### Public content request

1. A page mounts in the React application.
2. The page requests the data it needs from the backend.
3. Express calls the matching Mongoose model and returns JSON.
4. React renders the response, showing loading or empty states where appropriate.

### Admin content update

1. The admin signs in and receives a JWT.
2. The dashboard submits create, update, or delete requests to the admin API with the bearer token.
3. The authorization middleware verifies the token and admin role.
4. The route validates the request and reads or updates the MongoDB record.
5. The public page reads the updated data from the public API.

### File upload

1. The dashboard sends an image or PDF as multipart form data to a protected upload route.
2. Multer receives the file in memory and applies file type and size checks.
3. The backend uploads the file to the appropriate Cloudinary folder.
4. The API returns the secure URL and Cloudinary public ID.
5. The management form saves the URL and metadata with its MongoDB content/settings record.

The database stores content and file references; the actual uploaded media files are stored by Cloudinary rather than inside the repository or MongoDB.

## Data models

The backend uses Mongoose schemas to define the editable records.

| Model | Main data |
| --- | --- |
| `About` | Name, title, image URL, biography paragraphs, and label/value information cards |
| `Skill` | Name, icon key, color, and display order |
| `Experience` | Company, period, role, type, skill list, highlights, and display order |
| `Project` | Title, description, image URL and public ID, technologies, links, publication status, and display order |
| `SiteSettings` | Shared home-page settings and resume URL/public ID |

Mongoose timestamps are enabled on these models. The public project route filters out unpublished projects, while the admin project route returns the full list for management. Skills and experience are ordered by the configured order value.

## Media storage and uploads

Cloudinary is used for uploaded media:

| Media | Cloudinary folder | Accepted format and limit |
| --- | --- | --- |
| Project image | `portfolio/projects` | JPG, PNG, or WebP; up to 5 MB |
| About profile image | `portfolio/about` | JPG, PNG, or WebP; up to 5 MB |
| Resume | `portfolio/resume` | PDF; up to 10 MB |

Uploads require admin authorization. Multer handles the incoming multipart form data in memory, and the backend streams the file to Cloudinary. MongoDB stores the resulting URLs and relevant public IDs so the frontend can load the assets.

## API reference

All routes are mounted under `/api`. Public `GET` routes do not require an admin token. Admin routes and every upload route require a valid admin JWT in the `Authorization` header.

### Public endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Reports whether the API is running and MongoDB is connected |
| `POST` | `/api/auth/login` | Validates admin credentials and returns a JWT |
| `GET` | `/api/about` | Returns the public About record |
| `GET` | `/api/skills` | Returns skills ordered for display |
| `GET` | `/api/experiences` | Returns experience records |
| `GET` | `/api/projects` | Returns published projects |
| `GET` | `/api/settings/home` | Returns home-page settings, including defaults when unset |
| `GET` | `/api/settings/resume` | Returns the public resume URL |

### Admin content endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET`, `PUT` | `/api/admin/about` | Read or update the About record |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/admin/skills` | List, add, update, or delete skills |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/admin/experiences` | List, add, update, or delete experience records |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/admin/projects` | List, add, update, or delete project records |
| `PUT` | `/api/settings/admin/home` | Update home-page settings |
| `PUT` | `/api/settings/admin/resume` | Save the Cloudinary resume URL and public ID |

For skill, experience, and project updates/deletions, the record ID is appended to the endpoint (for example, `/api/admin/skills/:id`).

### Upload endpoints

| Method | Endpoint | Form field | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/uploads/project-image` | `file` | Upload a project image |
| `POST` | `/api/uploads/about-image` | `file` | Upload an About profile image |
| `POST` | `/api/uploads/resume` | `resume` | Upload a resume PDF |

## Technology choices

### Frontend

- **React** organizes the site into reusable components and page-level views.
- **Vite** provides the development server and creates the production frontend bundle.
- **React Router** handles client-side navigation. The application uses `HashRouter`, which keeps routes compatible with static hosting that does not rewrite arbitrary paths.
- **Tailwind CSS** provides responsive utility styling, with custom CSS for shared visual effects.
- **Framer Motion** supplies selected motion and page/carousel transitions.
- **Lucide React** provides interface icons such as navigation, actions, and form indicators.
- **Iconify Simple Icons** provides technology logos for the dynamically managed Skills page.
- **EmailJS** sends the Contact form directly to the configured email service.

### Backend

- **Express** defines the API and middleware.
- **Mongoose** maps MongoDB documents to the portfolio models.
- **Multer** parses and limits multipart file uploads.
- **Cloudinary SDK** streams uploaded files to remote media storage.
- **bcryptjs** compares the submitted admin password against a stored password hash.
- **JSON Web Tokens** carry the admin role for protected API requests.
- **express-rate-limit** limits repeated login attempts.
- **CORS** allows the configured portfolio frontend to call the API.

`react-icons` is present in the frontend dependencies but is not currently imported by the application source. The UI icons are from Lucide React; technology logos use Iconify's Simple Icons SVG service.

## Project structure

```text
My-Portfolio/
├── public/
│   ├── favicon.png
│   ├── robots.txt
│   └── sitemap.xml
├── server/
│   ├── middleware/
│   │   └── auth.js                    # JWT admin authorization
│   ├── models/
│   │   ├── About.js                   # About profile schema
│   │   ├── Experience.js              # Experience schema
│   │   ├── Project.js                 # Project schema and publication flag
│   │   ├── SiteSettings.js            # Home settings and resume references
│   │   └── Skill.js                   # Skill schema
│   ├── routes/
│   │   ├── aboutRoutes.js             # Public About API
│   │   ├── adminAboutRoutes.js        # Protected About management
│   │   ├── adminExperienceRoutes.js   # Protected experience management
│   │   ├── adminProjectRoutes.js      # Protected project management
│   │   ├── adminSkillRoutes.js        # Protected skill management
│   │   ├── authRoutes.js              # Admin login
│   │   ├── experienceRoutes.js        # Public experience API
│   │   ├── projectRoutes.js           # Public published-project API
│   │   ├── settingsRoutes.js          # Home and resume settings
│   │   ├── skillRoutes.js             # Public skills API
│   │   └── uploadRoutes.js             # Protected Cloudinary uploads
│   ├── package.json
│   └── server.js                      # Express app and database startup
├── src/
│   ├── assets/                        # Bundled logos and images
│   ├── components/                    # Shared navigation and UI components
│   ├── pages/
│   │   ├── admin/                     # Admin dashboard and management forms
│   │   ├── About.jsx
│   │   ├── Admin.jsx                  # Login/session wrapper
│   │   ├── Contact.jsx
│   │   ├── Experience.jsx
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   └── Skill.jsx
│   ├── seo/                           # SEO component and page metadata
│   ├── App.jsx                        # Routes and lazy-loaded pages
│   └── main.jsx                       # React application entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

Local environment files, dependency directories, lockfiles, and generated build output are intentionally not part of this source overview. Keep private configuration out of version control.

## Run the project locally

### Prerequisites

- Node.js `20.19+` or `22.12+` and npm (required by the Vite version used here).
- A MongoDB database that the backend can reach.
- A Cloudinary account to enable image and resume uploads.
- An EmailJS account to enable Contact form delivery.

### 1. Install frontend packages

From the project root:

```bash
npm install
```

### 2. Install backend packages

In a second terminal:

```bash
cd server
npm install
```

### 3. Configure integrations privately

Before starting the applications, configure the frontend API address and EmailJS integration, and configure the backend database connection, Cloudinary account, admin login, token signing, port, and allowed frontend origin.

Provide these values through untracked local environment files or your hosting provider's secret settings. This README intentionally does not include an environment-file template or credentials. Never place private backend credentials in frontend `VITE_` settings; those values are exposed in the browser bundle.

### 4. Start the backend

From the `server/` directory:

```bash
npm run dev
```

The backend listens on port `5000` by default and connects to MongoDB before it starts listening. Check its status at `http://localhost:5000/api/health`.

### 5. Start the frontend

In another terminal, return to the project root and run:

```bash
npm run dev
```

Open the frontend URL printed by Vite (normally `http://localhost:5173`). Visit `/#/admin` to open the admin login.

## Build and quality checks

Run frontend checks from the project root:

```bash
npm run lint
npm run build
```

To serve the production build locally after building:

```bash
npm run preview
```

To start the backend without watch mode, run this from `server/`:

```bash
npm start
```

## Deployment guide

The frontend and API are separate deployable applications:

1. **Deploy the frontend** as a Vite static site. Configure its production API address and EmailJS integration in the frontend host's build settings.
2. **Deploy the backend** to a Node.js host. Configure MongoDB, Cloudinary, admin authentication, port, and CORS settings in the backend host's private settings.
3. **Allow the frontend origin** in the backend CORS configuration so browser requests are accepted from the deployed site.
4. **Use HTTPS** for the public site and API.
5. **Update site metadata** when using a different domain or portfolio owner. Review page SEO metadata, `public/robots.txt`, and `public/sitemap.xml`.
6. **Restrict service access** using MongoDB network access controls and appropriately scoped provider credentials.

The current frontend is linked to Netlify. The backend can be hosted independently; configure the frontend to use the URL of the backend deployment.

## Security notes

- Do not commit `.env` files, API keys, database connection strings, passwords, password hashes, or JWT secrets.
- Treat any credential that has appeared in a public commit, shared text, or support conversation as exposed and rotate it.
- Keep Cloudinary's private API secret and the JWT signing secret on the backend only.
- Frontend build-time variables are included in client-side code. They are not a place for database or server secrets.
- Use a strong admin password and a long, unique token signing secret in production.

## Adapting this project

To build a similar portfolio for yourself:

1. Replace the owner's name, profile details, contact links, social links, and images with your own.
2. Update the page titles, descriptions, SEO metadata, robots file, sitemap, and live-site URL.
3. Create your own MongoDB database and Cloudinary account, then configure the backend privately.
4. Set up an admin username and a bcrypt password hash for your own account; do not reuse credentials from another project.
5. Configure your own EmailJS service and template if you want the contact form enabled.
6. Add your initial About, Home, Skills, Experience, Projects, and Resume content using the admin dashboard.
7. Deploy the frontend and backend, update the API origin and CORS allowlist, and verify the health endpoint and public pages.

The dashboard can manage the portfolio content, but branding, page layout, contact/social destinations, and some visual behavior are still defined in the frontend source. Adjust those components when you want to change the design or add new types of content.

## Contact

- **LinkedIn:** [linkedin.com/in/bharath070](https://www.linkedin.com/in/bharath070/)
- **GitHub:** [github.com/BharathKarthick](https://github.com/BharathKarthick)
- **Email:** [pbharath6001@gmail.com](mailto:pbharath6001@gmail.com)
- **WhatsApp:** [+91 8608975629](https://wa.me/918608975629)
