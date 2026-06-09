# Checkpoint

A full-stack social media web application built with MongoDB, Express, React, and Node (MERN).

**Live URL:** [https://checkpoint-ruddy.vercel.app/](https://checkpoint-ruddy.vercel.app/)  
**GitHub Repo:** [https://github.com/nathanrsxtn/checkpoint](https://github.com/nathanrsxtn/checkpoint)

## Local Setup

```bash
# Clone the repository
git clone https://github.com/nathanrsxtn/checkpoint.git

# Navigate into the project directory
cd checkpoint

# Install dependencies
pnpm install

# Create a .env file following the .env example format
cp .env.example .env

# Start the development server
pnpm run dev

# Copy the provided link into your browser
```

> **Note:** This project uses `pnpm` as the package manager.
> If using `npm` instead, write `npm` instead of `pnpm` when running commands.

## Tech Stack

### Frontend
| Technology   | Purpose                         |
| ------------ | ------------------------------- |
| React        | UI Component Framework          |
| Vite         | Build Tool & Development Server |
| React Router | Multi-View Navigation Handler   |
| Tailwind CSS | Rapid Styling Development       |
| Sonner       | In-App Toast Notifications      |

### Backend
| Technology | Purpose             |
| ---------- | ------------------- |
| Node.js    | Runtime Environment |
| Express.js | REST API Framework  |

### Database
| Technology | Purpose                                |
| ---------- | -------------------------------------- |
| MongoDB    | NoSQL Database (MongoDB Atlas)         |
| Mongoose   | JavaScript Object Modeling for MongoDB |

### Authentication
| Technology           | Purpose               |
| -------------------- | --------------------- |
| JSON Web Token (JWT) | Secure Authentication |
| bcryptjs             | Password Hashing      |

### Version Control & Development
| Tool    | Purpose                         |
| ------- | ------------------------------- |
| Git     | Version Control                 |
| GitHub  | Remote Repository Hosting       |
| pnpm    | Package Manager                 |
| Biome   | All-In-One Formatter and Linter |
| Vitest  | Unit Testing Framework          |
| VS Code | Code Editor                     |

## Project Scripts

| Script                   | Description                       |
| ------------------------ | --------------------------------- |
| `pnpm run dev`           | Start the development server      |
| `pnpm run build`         | Build for production              |
| `pnpm run preview`       | Preview the production build      |
| `pnpm run check`         | Check for linting issues          |
| `pnpm run fix`           | Auto-fix linting issues           |
| `pnpm run test`          | Run tests with Vitest             |
| `pnpm run test:coverage` | Run tests with coverage reporting |

---

## What We Learned

Throughout developing the Checkpoint app, we learned how to build a full stack web application with React, Express, MongoDB, and Vercel/Render. We learned to use APIs and Loaders to communicate between front and backend, we learned how to use JS and CSS files to implement features and style them. We also learned how to authenticate using JWT and hashing, as well as managing, storing, and updated data using MongoDB and Mongoose. We also learned how to work as a team, keeping frequent communication about potential meetings, and features we were working on, as updates to the application. We also learned proper presentation habits through multiple milestone presentations as well as a final project presentation.
