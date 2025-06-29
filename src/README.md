# ENTNT Dental Center Management Dashboard (Frontend Assignment)

## Project Overview

This project is a single-page application (SPA) developed using React.js for the ENTNT Dental Center Management Dashboard. It's designed to manage patient information, dental appointments (referred to as "incidents"), and provide an overview for both administrative staff (Dentists) and patients.

**Key Features:**
* **User Authentication (Simulated):** Supports `Admin` and `Patient` roles with hardcoded credentials and session persistence via `localStorage`.
* **Patient Management (Admin-only):** Comprehensive CRUD (Create, Read, Update, Delete) operations for patient records, including full name, DOB, contact info, and health information.
* **Appointment/Incident Management (Admin-only):** Allows administrators to manage multiple appointments/incidents per patient. Features include setting appointment details (title, description, datetime), adding post-appointment information (cost, treatment notes, status), and attaching files.
* **Calendar View (Admin-only):** A dynamic calendar view displaying scheduled appointments, with the ability to click on a day to see its associated treatments.
* **Dashboard (Admin-only Landing Page):** Provides Key Performance Indicators (KPIs) such as total patients, total appointments, and total revenue from completed incidents. It also lists the next 10 upcoming appointments.
* **My Appointments (Patient-only):** Patients can log in to view their historical and upcoming appointments, including details like treatment notes, costs, and attached files.

## Live Demo

* **Deployed Application:** [Your Vercel App URL Here] (e.g., `https://entnt-dental-dashboard.vercel.app`)

## Technologies Used

* **React.js:** Frontend library for building user interfaces.
* **React Router DOM:** For declarative routing within the application.
* **Material-UI (MUI):** A popular React UI framework for beautiful and responsive components.
* **Context API:** For global state management (Authentication and Data).
* **date-fns:** A modern JavaScript date utility library for date manipulations in the Calendar View.
* **`localStorage`:** Used for simulating backend data persistence as per assignment requirements.

## Setup and Installation

Follow these steps to get the project up and running locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The application will open in your browser at `http://localhost:3000`.

## Architecture and Technical Decisions

* **Frontend-Only with `localStorage`:** The assignment's core constraint of "no backend or API" was addressed by using `localStorage` to simulate all data storage and retrieval. This is managed primarily by `DataContext.js` and `AuthContext.js`, which abstract away the `localStorage` interactions from the components.
* **Context API for State Management:** `AuthContext` handles user authentication state (login/logout, `currentUser`), while `DataContext` manages all application data (patients, incidents). This keeps the state centralized and easily accessible throughout the component tree without prop drilling.
* **Role-Based Access Control:** Implemented directly within `App.js` using `React Router` to conditionally render routes based on the `currentUser`'s role. Additionally, individual components (`CalendarView.js`, `MyAppointments.js`) perform checks to display appropriate messages if a user with an incorrect role tries to access them directly.
* **Modular Component Design:** The application is broken down into reusable components (e.g., `PatientForm`, `IncidentForm`, `MainLayout`) and pages (`Dashboard`, `PatientManagement`, etc.) to enhance maintainability and readability.
* **Material-UI Integration:** Utilized MUI components for a consistent and modern UI/UX, reducing the need for custom CSS.
* **Date Handling:** The `date-fns` library was chosen for its lightweight nature and immutable date operations, which are beneficial for calendar functionalities.
* **File Upload Simulation:** The `IncidentForm` demonstrates a file upload mechanism that converts files to Base64 strings for storage within `localStorage`. This simulates file attachments without needing actual server-side storage.

## Mock Data

The application uses hardcoded mock data for users, patients, and incidents, defined in `src/data/mockData.js`. This data is initially loaded into `localStorage` if not present, providing a persistent state across browser sessions.

**Login Credentials:**

* **Admin:**
    * Email: `admin@entnt.in`
    * Password: `admin123`
* **Patient:**
    * Email: `mahesh@entnt.in`
    * Password: `entnt123`

## Known Issues or Limitations

* **No Backend:** All data is stored in `localStorage`, meaning it's tied to the user's browser. It is not shared across devices or users.
* **Simple Authentication:** The authentication is purely client-side simulation; there's no secure server-side validation.

