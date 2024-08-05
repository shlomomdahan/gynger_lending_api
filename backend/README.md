# Gynger Lending API

This is the Gynger Lending API built with Node.js and PostgreSQL. Follow the instructions below to set up the project.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

### PostgreSQL Installation

#### Mac

1. Install PostgreSQL using Homebrew:

   ```
   brew install postgresql
   ```

2. Start PostgreSQL service:

   ```
   brew services start postgresql
   ```

3. Verify PostgreSQL installation:
   ```
   psql --version
   ```

#### Windows

1. Download and install PostgreSQL from [here](https://www.postgresql.org/download/windows/).
2. Verify PostgreSQL installation:
   ```
   psql --version
   ```

#### Linux

1. Update package lists and install PostgreSQL:

   ```
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. Start PostgreSQL service:

   ```
   sudo systemctl start postgresql
   ```
   
3. Verify PostgreSQL installation:
   ```
   psql --version
   ```

### Node.js Project Installation

1. Clone the repository:

   ```
   git clone https://github.com/shlomomdahan/lending-api.git
   cd lending-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Database Setup

1. **Create the `gynger_lending` database:**
   ```
   createdb gynger_lending
   ```

2. **Run the SQL commands from `database.sql` to create the tables:**
   ```
   psql -d gynger_lending -f database.sql
   ```

## Start the Server

1. **Start the Node.js server:**
```
npm start
```
2. **The server will be running on http://localhost:3000. You can test the API using the / endpoint:**
```
curl http://localhost:3000/
```



