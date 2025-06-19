# Recall.ai Recording Viewer

This is a demo application that showcases how to use the Recall.ai API to build a repository of all your meeting recordings without needing to store them in your own database. It provides a simple web interface to browse, watch, and search through your meetings.

A key feature of this application is the ability to deep-link into a specific moment in a meeting. You can copy a link to a specific timestamp in any meeting to share it with others.

## Prerequisites

- Node.js
- A Recall.ai API Key

## Installation

1.  **Clone the Repository**

    ```bash
    git clone -b api/v1.10 https://github.com/recallai/recording-viewer-demo.git
    cd recording-viewer-demo
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

## Configuration

1.  In the root of the project, create a file named `.env`.
2.  Add your Recall.ai API key to the `.env` file like this:

    ```
    RECALL_API_KEY=YOUR_RECALL_API_KEY
    ```

## Usage

1.  **Start the server**

    ```bash
    npm start
    ```

2.  Open your browser and navigate to `http://localhost:3000`.

You will see a list of your meeting recordings. Click on a meeting to view the recording, transcript, and other details.
