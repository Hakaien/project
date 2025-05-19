# Dashboard Application

This project is a dashboard application designed for project management, allowing users to create, track, and organize projects within defined user groups. The application consists of two main components: an Angular frontend and a Symfony backend.

## Project Structure

- **angular-frontend**: Contains the Angular application responsible for the user interface.
  - **src/app**: Main application components, services, and modules.
  - **src/environments**: Environment configuration files for different build environments.
  - **package.json**: Configuration file for npm, listing dependencies and scripts.
  - **angular.json**: Angular workspace configuration file.
  - **tsconfig.json**: TypeScript configuration file.
  - **README.md**: Documentation specific to the Angular frontend.

- **symfony-backend**: Contains the Symfony application that serves as the API and handles backend logic and database management.
  - **config**: Configuration files for routing, services, and parameters.
  - **public**: Document root containing the entry point for the application.
  - **src**: Main application code, including controllers, entities, repositories, and services.
  - **migrations**: Migration files for managing database schema changes.
  - **bin**: Executable files, including console commands.
  - **var**: Temporary files, logs, and cache.
  - **vendor**: Third-party libraries and dependencies installed via Composer.
  - **composer.json**: Configuration file for Composer, listing dependencies and scripts.
  - **composer.lock**: Locks the versions of the dependencies installed via Composer.
  - **README.md**: Documentation specific to the Symfony backend.

## Setup Instructions

### Prerequisites

- PHP >= 7.4
- Composer
- Node.js >= 14.0.0
- npm >= 6.0.0
- MySQL or PostgreSQL database

### Installation

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd dashboard-app
   ```

2. **Set up the Symfony backend**:
   - Navigate to the `symfony-backend` directory:
     ```
     cd symfony-backend
     ```
   - Install dependencies using Composer:
     ```
     composer install
     ```
   - Configure your database connection in the `.env` file.

3. **Set up the Angular frontend**:
   - Navigate to the `angular-frontend` directory:
     ```
     cd ../angular-frontend
     ```
   - Install dependencies using npm:
     ```
     npm install
     ```

### Running the Application

- **Start the Symfony backend**:
  ```
  php -S localhost:8000 -t public
  ```

- **Start the Angular frontend**:
  ```
  ng serve --port 4200
  ```

### Accessing the Application

- The Angular frontend will be accessible at `http://localhost:4200`.
- The Symfony backend API will be accessible at `http://localhost:8000`.

## Features

- User management with roles (Administrator, Project Manager, Developer, Support, Project Consultant, External Provider).
- Project management with categories, tags, and status tracking.
- Group management allowing users to belong to multiple groups.
- Project archiving and restoration capabilities.
- Notification system for internal alerts.
- Historical action logging based on user roles.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.