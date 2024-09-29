# Gefami Library App

Welcome to the Gefami Library App! This application allows users to manage books, borrow them, and return them.
Implemented using Python (Django Framework) for creating API and Javascript Vanilla for frontend.
Follow the instructions below to get started.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation Instructions](#installation-instructions)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Additional Information](#additional-information)


## Features

- View available books
- Borrow and return books
- Check borrowed books and their due dates

## Requirements

To run the Gefami Library App on your local machine, you need the following:

- Python (version 3.6 or higher)
- pip (Python package installer)
- Git (to clone the repository)

## Installation Instructions

1. **Clone the Repository:**

   Open your terminal (Command Prompt, PowerShell, or Terminal) and run the following command to clone the repository:

   ```bash
   git clone https://github.com/ysmnababan/GefamiLibraryApp.git
   ```

   Navigate into the project directory:

   ```bash
   cd GefamiLibraryApp
   ```

2. **Set Up a Virtual Environment (Optional but recommended):**

   Create a virtual environment to keep your dependencies organized:

   ```bash
   python -m venv venv
   ```

   Activate the virtual environment:

   - On Windows:

     ```bash
     venv\Scripts\activate
     ```

   - On macOS/Linux:

     ```bash
     source venv/bin/activate
     ```

3. **Install Required Packages:**

   Use pip to install the necessary packages. Run the following command:

   ```bash
   pip install -r requirements.txt
   ```

   This command will install all the dependencies listed in the `requirements.txt` file.

## Running the Application

1. **Run Database Migrations:**

   Before running the application, apply database migrations by executing:

   ```bash
   python manage.py migrate
   ```

2. **Create a Superuser :**

   To access the admin panel, you may want to create a superuser account:

   ```bash
   python manage.py createsuperuser
   ```

   Follow the prompts to create your admin account.
   You must manually input the book by accessing the admin panel http://127.0.0.1:8000/admin/

3. **Start the Development Server:**

   Launch the application by running:

   ```bash
   python manage.py runserver
   ```

   You should see output indicating that the server is running. By default, the app will be accessible at `http://127.0.0.1:8000/`.

## Usage

- Open your web browser and go to `http://127.0.0.1:8000/` to access the application.
- If you created a superuser, you can access the admin panel at `http://127.0.0.1:8000/admin/` to manage books and users.
- If you want to test the API, you can import the Postman collection `GefamiLibraryApp.postman_collection.json` file and import it to Postman.
- You can access the interface by opening the `index.html` file in your browser and try the functionality.

## Additional Information
- If you want to see the ERD of the backend app, you can check the `system_design` folder.

---

Thank you for using the Gefami Library App! If you have any questions or issues, feel free to reach out.
