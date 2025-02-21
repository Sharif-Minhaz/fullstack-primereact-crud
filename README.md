# Todo App - Full Stack Project

This is a full-stack **Todo App** built with:

-   **Client** : React (Vite) + PrimeReact
-   **Server** : Node.js (Raw Node.js, No Express) + MySQL (Raw SQL Queries)

## 📂 Project Structure

```
project-root/
│── client/  # Frontend (React + Vite + PrimeReact)
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── hooks/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│── server/  # Backend (Node.js + MySQL + AWS)
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/todoModel.js
│   │   ├── controllers/todoController.js
│   │   ├── routes/todoRoutes.js
│   │   ├── utils/responseHandler.js
│   ├── server.js
│── .gitignore
│── package.json
│── README.md
```

## 🚀 Getting Started

### 1️⃣ Setup Backend (Server)

1. **Navigate to the `server/` folder:**

    ```sh
    cd server
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Create a `.env` file** in the `server/` directory and configure the database:

    ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=

     ALLOWED_ORIGIN=http://localhost:3000

     AWS_REGION=

     AWS_COGNITO_APP_ID=
     AWS_COGNITO_APP_SECRET=
     AWS_COGNITO_USER_POOL_ID=
     AWS_COGNITO_DOMAIN=
     AWS_COGNITO_REDIRECT_URI=http://localhost:8000/login
     AWS_COGNITO_LOGIN_URL=
     AWS_COGNITO_LOGOUT_URI=
     AWS_COGNITO_FINAL_URI=http://localhost:3000
     AWS_COGNITO_HOST_NAME=

     AWS_S3_BUCKET_ACCESS_KEY_ID=
     AWS_S3_BUCKET_SECRET_ACCESS_KEY=
     AWS_S3_BUCKET_ARN=
     AWS_S3_BUCKET_NAME=`
    ```

4. **Start the backend server:**

    ```sh
    npm run dev
    ```

### 2️⃣ Setup Frontend (Client)

1. **Navigate to the `client/` folder:**
    ```sh
    cd client
    ```
2. **Install dependencies:**
    ```sh
    npm install
    ```
3. **Start the frontend server:**
    ```sh
    npm run dev
    ```
4. Open **[http://localhost:3000](http://localhost:3000/)** to see the app running.

## 📌 API Endpoints

| Method | Endpoint        | Description                                |
| ------ | --------------- | ------------------------------------------ |
| GET    | `/todos`        | Get all todos for logged in user           |
| GET    | `/todos/:id`    | Get a specific todo                        |
| POST   | `/todos`        | Create a new todo                          |
| PUT    | `/todos/:id`    | Update a todo (title, description, status) |
| DELETE | `/todos/:id`    | Delete a todo                              |
| POST   | `/login`        | Log in the user                            |
| GET    | `/auth/profile` | Get the current user's information         |
| POST   | `/auth/logout`  | Log out the user                           |

## 🎨 Frontend Tech Stack

-   **Vite** : Fast development build tool
-   **React** : Component-based UI
-   **PrimeReact** : UI components for styling

## 🛠 Backend Tech Stack

-   **Node.js (Raw)** : No Express, handling requests manually
-   **MySQL** : Database for storing todos
-   **AWS**: Several Backend services

## 🤝 Contributions

Feel free to contribute by opening issues or pull requests!

---

Made with ❤️ by Sharif-Minhaz

```

```
