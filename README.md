# BookShelf 📚

## Description 💻
A fullstack platform where book lovers can discover, add and review books. Registered users can add books they have read with a synopsis for other readers to browse. They can also write reviews and rate any book in the catalogue. Only admins and the original creators can edit or delete their own books and reviews.

## Tech Stack 🛠️
- **Runtime:** Node.js
- **Framework:** Express.js
- **DataBase:** MongoDB + Mongoose
- **Authentification:** JWT + Bcrypt
- **FrontEnd:** React + Vite (Not done yet)
- **Deployment:** Vercel

## Features
- 🔐 User registration and login with JWT authentification
- 👤 Role-based access control (user/admin)
- 📖 Browse and search books by title and author
- ➕ Add books with title, author, genre, synopsis and cover image
- ⭐ Write, edit and delete reviews with a rating from 1 to 5
- 🛡️ Admin can manage all users, books and reviews
- 📁vDatabase seeded from CSV files using Node.js fs module

## Getting Started

### Prerequisites ✅ 
- Node.js v18+
- MongoDb Atlas account

### Installation 📦
1. Clone the repository
```bash
git clone https://github.com/Ren-mayday/proyecto-13-bookshelf-backend-react.git
cd proyecto-13-bookshelf-backend-react
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root of the project
```bash
cp .env.example .env
```

4. Seed the database
```bash
npm run seed
```

5. Start the server
```bash
npm run dev
```
### Environment Variables ⚙️

| Variable | Description |
|----------|-------------|
| PORT | |
| URL_DB | |
| JWT_SECRET | |

### Running the project 🚀
| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the server in deploymnet mode |
| `npm start` | Start the server in production |
| `npm run sed` | Seed the database with initial data |

## API Endpoints

### Users 👤

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/users | | Admin |
| GET | /api/v1/users/:id | | Auth |
| POST | /api/v1/users/register | | Public |
| POST | /api/v1/users/login | | Public |
| PUT | /api/v1/users/update/:id | | Auth |
| DELETE | /api/v1/users/:id | | Auth |

### Books 📚

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/books | | Public |
| GET | /api/v1/books/:id | | Public |
| POST | /api/v1/books | | Auth |
| PUT | /api/v1/books/:id | | Auth |
| DELETE | /api/v1/books/:id | | Auth |

### Reviews 📝

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/reviews | | Public |
| POST | /api/v1/reviews/:bookId | | Auth |
| PUT | /api/v1/reviews/:id | | Auth |
| DELETE | /api/v1/reviews/:id | | Auth |

## Data Models

### User 👤
| Field | Type | Required |
|-------|------|----------|
| userName | String | Yes |
| email | String | Yes |
| password | String | Yes |
| role | String (user/admin) | Yes |
| avatar | String | No |
| favouriteGenres | [String] | No |

### Book 📚
| Field | Type | Required |
|-------|------|----------|
| title | String | Yes |
| author | String | Yes |
| genre | String | Yes |
| year | Number | No |
| synopsis | String | No |
| coverImage | String | No |
| pages | Number | No |
| language | String | No |
| createdBy | ObjectId (ref: User) | No |

### Review 📝
| Field | Type | Required |
|-------|------|----------|
| user | ObjectId (ref: User) | Yes |
| book | ObjectId (ref: Book) | Yes |
| rating | Number (1-5) | Yes |
| comment | String | Yes |
## Deployment

## Author 👩🏽‍💻
- **Name:** Rencel
- **GitHub:** [Ren-mayday](https://github.com/Ren-mayday)