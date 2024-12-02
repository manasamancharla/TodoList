# TodoList App 📋

A **TodoList App** built with **React Native** for seamless task management. Powered by **Appwrite** for backend services, the app allows users to create, organize, and track their tasks efficiently.

## Features ✨

- **User Authentication**: Sign up, log in, and manage accounts.
- **Customizable Todo Lists**: Create lists with unique colors and names.
- **Todo Completion Tracking**: Monitor completed todos for each list.
- **Avatar Management**: Users can upload, update, and display their profile avatars.

<div style="display: flex; justify-content: space-between;">
<img src="https://github.com/manasamancharla/Demo/blob/main/assets/readme/screen1.jpeg" alt="Alt Text" width="300" height="700">
<img src="https://github.com/manasamancharla/Demo/blob/main/assets/readme/screen2.jpeg" alt="Alt Text" width="300" height="700">
<img src="https://github.com/manasamancharla/Demo/blob/main/assets/readme/screen3.jpeg" alt="Alt Text" width="300" height="700">
<img src="https://github.com/manasamancharla/Demo/blob/main/assets/readme/screen5.jpeg" alt="Alt Text" width="300" height="700">
</div>

## Tech Stack 💻

- **Frontend**: React Native with NativeWind for styling.
- **Backend**: Appwrite for authentication, database, and storage.
- **Database**: Appwrite's Document-Based Database.
- **Storage**: Appwrite's Storage for handling user avatars.

## Schema Overview 📋

The application uses the following collections:

### **Users**

Stores user information for authentication and profile management.

- **Attributes**:
  - `Document ID` (Primary Key)
  - `username`: The user's display name.
  - `email`: The user's email address.
  - `avatar`: URL of the user's avatar stored in Appwrite's storage.
  - `accountId`: The ID linked to Appwrite's authentication.

### **TodoLists**

Represents individual to-do lists owned by users.

- **Attributes**:
  - `Document ID` (Primary Key)
  - `name`: Name of the to-do list.
  - `color`: Custom color for the to-do list.
  - `users`: Relationship field linking to the `Users` collection.

### **Todos**

Stores tasks associated with a to-do list.

- **Attributes**:
  - `Document ID` (Primary Key)
  - `task`: The content of the to-do task.
  - `completed`: Boolean to indicate task completion.
  - `todoList`: Relationship field linking to the `TodoLists` collection.

### Schema Diagram

```plaintext
Users (PK: Document ID)
|-- username
|-- email
|-- avatar
|-- accountId

  |
  | 1:N
  v

TodoLists (PK: Document ID)
|-- name
|-- color
|-- users (relationship to Users)

  |
  | 1:N
  v

Todos (PK: Document ID)
|-- task
|-- completed
|-- todoList (relationship to TodoLists)
```

## Getting Started 🚀

Follow these steps to run the app locally:

### Prerequisites

- Node.js LTS version
- Expo CLI installed globally
- Appwrite instance set up and configured
- Required Appwrite collections created (`Users`, `TodoLists`, `Todos`)
- Appwrite storage bucket

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/manasamancharla/TodoList.git
   cd TodoList
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add your instance details in appwrite.ts

4. Start the development serve:
   ```bash
   npm run start
   ```

## Contributing 🤝

Contributions are welcome!

## License 📜

This project is licensed under the MIT License. See the LICENSE file for details.
