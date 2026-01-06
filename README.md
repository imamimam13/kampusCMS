# 🎓 KampusCMS

**KampusCMS** is a modern, comprehensive Content Management System designed specifically for Indonesian universities and academic institutions. Built with the latest web technologies, it offers a seamless experience for managing academic portals, news, events, and alumni data.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## ✨ Key Features

### 🏛️ Public Portal
-   **Dynamic Page Builder**: Create custom pages with a drag-and-drop block interface.
-   **News & Event Management**: Publish academic updates and schedule events.
-   **Staff & Lecturer Profiles**: Dedicated pages for faculty members with PDDikti integration support.
-   **Gallery & Downloads**: centralized media and document repositories.
-   **SEO Optimized**: Built-in meta tag management and server-side rendering.

### 🎓 Academic Tools
-   **Tracer Study**: Complete module for tracking alumni career paths with analytics.
-   **Program Studi**: Detailed pages for each study program with curriculum visualization.
-   **Curriculum Management**: Structure courses and semesters.

### 🛠️ Administration
-   **Role-Based Access Control**: Secure dashboard for Admins, Editors, and Lecturers (`dosen`).
-   **Media Manager**: Centralized file handling.
-   **Site Settings**: Configure university identity, logos, and theme colors directly from the dashboard.

## 🛠️ Technology Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Database**: PostgreSQL
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + Tailwind CSS
-   **Authentication**: NextAuth.js (v5)
-   **Deployment**: Docker & Nginx

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

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🐳 Deployment (Docker / Portainer / CasaOS)

This project allows fully automated deployment using Docker.

### Architecture
-   **kampuscms**: The main Next.js application.
-   **db**: PostgreSQL database (isolated in internal network).
-   **nginx**: Custom Nginx reverse proxy (handles traffic referencing `kampuscms` service).
-   **watchtower**: Automates container updates when new code is pushed.

### Deployment Steps

1.  **Pull the Stack**
    Copy the `docker-compose.yml` file to your server (Portainer/CasaOS/Docker Swarm).

2.  **Run the Stack**
    ```bash
    docker-compose up -d
    ```

    > **Note:** The Nginx configuration is baked into the custom image `imamwb/kampuscms-nginx`, so you don't need to manually mount config files.

3.  **Access the Site**
    -   Public Web: `http://YOUR_SERVER_IP:8080`
    -   Admin Panel: `http://YOUR_SERVER_IP:8080/admin`

### CI/CD Pipeline
This repository creates two Docker images automatically via GitHub Actions:
-   `imamwb/kampuscms:latest` (Application)
-   `imamwb/kampuscms-nginx:latest` (Nginx Configured)

Pushing to `main` triggers a rebuild, and Watchtower on your server will automatically pull the new images and restart the services.

## 📂 Project Structure

```
├── prisma/               # Database schema & migrations
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions (prisma, utils)
│   └── types/            # TypeScript definitions
├── Dockerfile            # App Docker configuration
├── Dockerfile.nginx      # Nginx Docker configuration
├── nginx.conf            # Nginx routing rules
└── docker-compose.yml    # Production deployment stack
```

## 📝 License

[MIT](LICENSE)
