<div align="center">
  <img src="public/kampuscms-logo.png" alt="KampusCMS Logo" width="200" />
  <h1>KampusCMS</h1>
</div>

**KampusCMS** is a modern, comprehensive, and **Multi-Tenant** Content Management System designed specifically for Indonesian universities and academic institutions. Built with the latest web technologies, it offers a seamless experience for managing academic portals, multiple landing pages, news, events, and alumni data from a single installation.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## ✨ Key Features

### 🌐 Multi-Site & Multi-Tenancy (New!)
-   **Single Instance, Multiple Sites**: Host the main university portal, landing pages for specific events (e.g., `pmb.univ.ac.id`), or faculty sites using subdomains or custom domains.
-   **Granular Settings**: Customize logos, colors, headers, and footers per site.
-   **Domain Management**: Built-in logic to handle `localhost`, subdomains, and custom domain mapping.

### 🏗️ Advanced Page Builder
-   **Drag-and-Drop Interface**: Intuitively build responsive pages without coding.
-   **Rich Block Library**:
    -   **Layout**: Hero Sections, Multi-column text, Feature Lists, Separators.
    -   **Content**: Text (Rich Text), Images, Videos, Carousels, Galleries.
    -   **Dynamic**: News Grids, Staff Linktrees, Event Calendars, Download Centers.
    -   **Integrations**: RSS Feeds (Google News), Social Media Embeds (Instagram, TikTok, YouTube).
    -   **Academic**: Tracer Study Stats, Program Studi Lists.
-   **Live Preview**: Real-time visual editing with typography control.

### 🏛️ Academic Modules
-   **Tracer Study**: Complete module for tracking and managing alumni career paths with analytics.
-   **Program Studi**: Detailed management for study programs including code, names, and descriptions.
-   **Staff & Lecturers**: Directory management with integration capability for academic profiles.
-   **Download Center**: Centralized document distribution organized by categories.
-   **Gallery**: Photo album management with multi-image upload support.

### 🛠️ System Administration
-   **Role-Based Access Control**: Secure dashboard for Super Admins, Admins, Editors, and Lecturers.
-   **Media Manager**: Centralized file handling for images and documents.
-   **Backup & Restore**: Full system backup (Database + Files) and one-click restore functionality.
-   **Maintenance Tools**: Built-in scripts for database seeding, domain repairs, and integrity checks.

## 🛠️ Technology Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Database**: PostgreSQL
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + Tailwind CSS v4
-   **Authentication**: NextAuth.js (v5)
-   **Deployment**: Docker & Nginx
-   **Image Handling**: Sharp (Local optimization)

## 🚀 Getting Started (Local Development)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/imamimam13/kampusCMS.git
    cd kampusCMS
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment**
    Copy `.env.example` to `.env` and configure your database connection:
    ```bash
    cp .env.example .env
    ```

4.  **Initialize Database**
    ```bash
    npx prisma generate
    npx prisma db push
    ```
    *Optionally seed the database:*
    ```bash
    npx prisma db seed
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🐳 Deployment (Docker / Portainer / CasaOS)

This project allows fully automated deployment using Docker.

### Architecture
-   **kampuscms**: The main Next.js application (Port 3000 internal).
-   **db**: PostgreSQL database (isolated in internal network).
-   **nginx**: Custom Nginx reverse proxy (Exposed on Host Port **8097**).
-   **watchtower**: Automates container updates when new code is pushed.

### Deployment Steps

1.  **Pull the Stack**
    Copy the `docker-compose.yml` file to your server (Portainer/CasaOS/Docker Swarm).

2.  **Run the Stack**
    ```bash
    docker-compose up -d
    ```

3.  **Access the Site**
    -   Public Web: `http://YOUR_SERVER_IP:8097`
    -   Admin Panel: `http://YOUR_SERVER_IP:8097/admin`

    > **Note:** Ensure your server allows traffic on port 8097, or modify `docker-compose.yml` to map to port 80.

### CI/CD Pipeline
This repository creates two Docker images automatically via GitHub Actions:
-   `imamwb/kampuscms:latest` (Application)
-   `imamwb/kampuscms-nginx:latest` (Nginx Configured)

Pushing to `main` triggers a rebuild, and Watchtower on your server will automatically pull the new images and restart the services.

## 📂 Project Structure

```
├── prisma/               # Database schema & migrations
├── public/               # Static assets
├── scripts/              # Maintenance & Utility scripts
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable React components
│   │   ├── admin/        # Admin dashboard components
│   │   ├── builder/      # Page Builder engine
│   │   └── ...
│   ├── lib/              # Utility functions (prisma, auth, etc.)
│   └── types/            # TypeScript definitions
├── Dockerfile            # App Docker configuration
├── Dockerfile.nginx      # Nginx Docker configuration
└── docker-compose.yml    # Production deployment stack
```

## 📝 License

[MIT](LICENSE)
