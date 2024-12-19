# Elephoria

Elephoria is a comprehensive web application built using the MERN stack (MongoDB, Express.js, React, Node.js). This project aims to provide a seamless user experience for various functionalities including games, audio editing, and anime media management.

## Table of Contents

-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   **Tic-Tac-Toe Games**: Play classic and ultimate versions of Tic-Tac-Toe.
-   **Audio Editor**: Upload and edit metadata for audio files.
-   **Anime Hub**: Import and manage your anime and manga lists from AniList.

## Installation

To get started with Elephoria, follow these steps:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Manishtripathi-108/Elephoria.git
    cd Elephoria
    ```

2. **Install dependencies for the backend**:

    ```bash
    cd backend
    npm install
    ```

3. **Install dependencies for the frontend**:

    ```bash
    cd ../frontend
    npm install
    ```

4. **Set up environment variables**:
    - Create a `.env` file in both the `backend` and `frontend` directories.
    - Add the necessary environment variables as specified in the `.env.example` files.

5. **Install ffmpeg** (required for the audio editor to work):
    - Follow the instructions on the [ffmpeg official website](https://ffmpeg.org/download.html) to install ffmpeg on your device.

## Usage

### Running the Backend

1. Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2. Start the backend server:

    ```bash
    npm start
    ```

3. Open your browser and go to `http://localhost:3000` to access backend API.

### Running the Frontend

1. Navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2. Start the frontend development server:

    ```bash
    npm run dev
    ```

3. Open your browser and go to `http://localhost:5173/` to access the frontend application.


## Contributing

We welcome contributions to Elephoria! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
