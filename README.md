# Stack ✦

Stack is a modern, premium academic blog application designed for publishing and sharing high-level academic and technical knowledge. It is tailored for content creators and readers passionate about subjects like **Mathematics, Physics, Chemistry, Operating Systems, AI, and Machine Learning**.

The application features a secure role hierarchy (Reader, Author, Admin), seamless user authentication, cover image hosting, and an **AI-powered summary generator** using Google Gemini.

---

## ✦ Key Features

- **Academic Categories:** Filter and organize posts under dedicated categories: Mathematics, Physics, Chemistry, Operating Systems, AI, and ML.
- **AI Blog Summarization:** Built-in integration with Google Gemini (`gemini-2.0-flash`) that automatically generates a concise summary of the article upon publication.
- **Interactive Reader Experience:** Users can search blogs, filter by categories, like posts, and bookmark articles to their profiles.
- **Interactive Role Upgrades:**
  - Readers can apply to become Authors directly from their dashboard.
  - Admins can view, approve, or reject these requests in a secure, real-time Admin Panel.
- **Detailed Analytics Dashboard:**
  - Admins view total system stats (total views, users, blogs, and pending requests).
  - Authors view their personal stats, draft blogs, and published content metrics.
- **Premium UX Design:** Dark mode layout with custom Inter and Playfair Display typography, responsive sidebar navigation, clean state transitions, and skeleton loaders.
- **Auto-Login:** Registration automatically logs the user in and routes them to their dashboard to optimize onboarding.

---

## ✦ Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Routing:** React Router v7
- **Styling:** CSS & Tailwind CSS v4
- **Utilities:** Axios (with request/response interceptors for token attachment & global 401 handling), DOMPurify (XSS prevention), Lucide React (Icons).

### Backend
- **Framework:** Node.js + Express
- **Database ORM:** Prisma ORM with MySQL
- **Authentication:** JWT (JSON Web Tokens) & BcryptJS
- **Media Upload:** Cloudinary SDK & Multer (multipart form processing)
- **AI Integration:** Google Generative AI SDK (`gemini-2.0-flash`)



## ✦ Database Schema

The database uses Prisma ORM with MySQL. Below is an overview of the key models:

1. **User:** Stores credentials and role (`READER`, `AUTHOR`, `ADMIN`).
2. **Blog:** Contains blog content, views, likes, category, status (`DRAFT`, `PUBLISHED`, `ACHIVED`), and references the Author.
3. **AuthorRequest:** Tracks reader applications to become authors (`PENDING`, `APPROVED`, `REJECTED`).
4. **Like / Bookmark:** Pivot tables tracking user actions on blogs to prevent double-interactions.
5. **Comment:** Standard comment structure with self-referencing relationship support for nested replies.



## ✦ Admin Initialization Guide

For security reasons, there is no public route or backend endpoint to register an Admin user. To create the first Admin:

1. Register a normal account through the frontend UI or `/api/auth/register` API.
2. Open Prisma Studio from the `backend/` directory:
   ```bash
   npx prisma studio
   ```
3. Locate the `User` model, find your newly registered user, and change the `role` field from `READER` to `ADMIN`.
4. Click **Save Changes** in Prisma Studio.
5. Log out and log back in on the frontend to refresh your JWT token with the new `ADMIN` permissions.

---

## ✦ API Endpoints

| Endpoint | Method | Auth Required | Role Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | | | | |
| `/api/auth/register` | POST | No | - | Register user (auto-login, returns JWT) |
| `/api/auth/login` | POST | No | - | Login user (returns JWT) |
| `/api/auth/me` | GET | Yes | - | Get current logged-in user profiles |
| **Blogs** | | | | |
| `/api/blogs` | GET | No | - | Get all published blogs (filters & search) |
| `/api/blogs/author/my-blogs`| GET | Yes | AUTHOR | Get blogs created by authenticated author |
| `/api/blogs/:slug` | GET | No | - | Get specific blog details by its URL slug |
| `/api/blogs` | POST | Yes | AUTHOR | Create a new blog post (triggers Gemini summary) |
| `/api/blogs/:id` | PUT | Yes | AUTHOR | Update a blog post (requires ownership) |
| `/api/blogs/:id` | DELETE | Yes | AUTHOR | Delete a blog post (requires ownership) |
| **Author Requests** | | | | |
| `/api/author-requests/apply`| POST | Yes | READER | Apply to become an Author |
| `/api/author-requests/my-request`| GET | Yes | READER | Get status of own author application |
| **Admin** | | | | |
| `/api/admin/requests` | GET | Yes | ADMIN | Get list of all pending author requests |
| `/api/admin/approve/:id` | POST | Yes | ADMIN | Approve author request (upgrades user to AUTHOR) |
| `/api/admin/reject/:id` | POST | Yes | ADMIN | Reject author request |
| **Dashboard** | | | | |
| `/api/dashboard/stats` | GET | Yes | AUTHOR/ADMIN | Fetch role-based stats for author or admin |
| **Likes / Bookmarks** | | | | |
| `/api/likes/toggle/:blogId`| POST | Yes | - | Toggle like on a blog |
| `/api/likes/check/:blogId` | GET | Yes | - | Check if current user liked a blog |
| `/api/bookmarks/toggle/:blogId`| POST| Yes | - | Toggle bookmark on a blog |
| `/api/bookmarks` | GET | Yes | - | Get all bookmarked blogs for current user |
