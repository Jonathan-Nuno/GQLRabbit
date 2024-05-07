# GQLRabbit API

## Description

This project is a NestJS-based GraphQL API that interacts with RabbitMQ for message handling and PostgreSQL for data persistence.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version recommended in `package.json` or later)
- [RabbitMQ](https://www.rabbitmq.com/download.html) with [Erlang](https://www.erlang.org/downloads)
- [PostgreSQL](https://www.postgresql.org/download/)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/getting-started/install) (for handling Node.js packages)
- [Postman](https://www.postman.com/downloads/) for testing endpoints

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://your-repository-url.git
   cd gqlrabbit

   ```

2. **Install Dependencies:**

   ```bash
   npm install

   ```

3. **Set up environment variables:**

- Create a '.env' file in the root directory.
- Add the necessary configuration:
  ```bash
  RABBITMQ_URL=amqp://localhost
  DATABASE_HOST=yourDbHostName
  DATABASE_PORT=yourPortNumber
  DATABASE_USER=yourDbUsername
  DATABASE_PASSWORD=yourDbPassword
  DATABASE_NAME=yourDbName
  ```
- Replace each item with your PostgreSQL credentials and database name. Update the RabbitMQ URL if your configuration differs.

## Running the Application

1. Start the PostgreSQL and RabbitMQ services. Ensure that they are running before starting the application.
2. Run the application in development mode:
   ```bash
   npm run start:dev
   ```

- This will start the server with hot-reloading enabled.

3. Access the API:

- The GraphQL playground can be accessed at http://localhost:3000/graphql when the server is running. This interface allows you to perform queries and mutations directly from your browser.

## Running Tests

To execute the automated tests for this project:

    npm run test

You can also watch tests in real-time as you develop:

    npm run test:watch

## Production Build

To create a production build:

    npm run build
    npm run start:prod

This will compile the TypeScript code and start the application using the compiled JavaScript code in the 'dist' directory.

## Using Postman

**1. Creating single edge:**

You can make a POST request to the below endpoint using the below body template:

**http://localhost:3000/edges**

    {
      node1Alias: "Node A",
      node2Alias: "Node B",
      capacity: 10000
    }

**2. Return a single edge:**

You can make a GET request to the below endpoint and return a single edge object:

**http://localhost:3000/edges/{ID}**

**3. Returning all edges:**

You can make a GET request to the below endpoint and return an array of edge objects:

**http://localhost:3000/edges**
