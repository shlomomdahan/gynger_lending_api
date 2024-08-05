# Gynger Lending API

## Quick Start with Docker

To run this project, you'll need Docker and Docker Compose installed on your machine.

1. Clone the repository:

```bash
git clone https://github.com/shlomomdahan/gynger_lending_api.git
cd gynger_lending_api
```

2. Build and start the containers:

```bash
docker-compose up --build
```

This command will build the images if they don't exist and start the containers.

3. The application will be available at:

- Backend API: [http://localhost:3000](http://localhost:3000)
- Frontend: [http://localhost:3001](http://localhost:3001)

4. To stop the application, use:

```bash
docker-compose down
```

## Docker Configuration

The project uses Docker Compose to manage the following services:

- Backend (Node.js/Express)
- Frontend (Next.js)
- Database (PostgreSQL)

You can view the full configuration in the `docker-compose.yml` file.

## Troubleshooting

If you encounter any issues:

1. Ensure all ports (3000, 3001, 5432) are available on your machine.
2. Check the Docker logs:

```bash
docker-compose logs
```

3. To rebuild the images after making changes:

```bash
docker-compose up --build
```
