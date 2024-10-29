# HomeShare — Shared Items Catalog for Building Residents

## Description
**HomeShare** is an application designed for residents of multi-apartment buildings, allowing them to add items to a shared catalog and reserve items that are available for common use. The platform provides residents with a convenient way to share useful items such as appliances, furniture for events, equipment, and more. HomeShare promotes cost-saving and encourages a culture of shared resources within the building community.

## Key Features

### 1. Items Catalog
- Residents can add their items to the catalog by filling out a form with the item name, description, category, photo, and available dates.
- Categories are provided for easy browsing, such as “Appliances,” “Furniture,” “Event Supplies,” and “Tools.”
- Users can edit and remove their items from the catalog when needed.

### 2. Reservations
- An interactive calendar allows users to select available dates for reserving an item.
- Once reserved, the item is marked as booked for the selected dates to prevent overlaps.
- The item owner receives notifications of new booking requests and can approve or reject them.

### 3. Notifications & Reminders
- Users receive notifications for upcoming reservations and reminders when the usage period ends.
- Owners are also notified of item return times if the item has set usage limits.

### 4. User Profile
- Each user has a profile page that includes a history of all reservations and items added to the catalog.
- Contact details are available, enabling users to reach out to each other regarding items.

### 5. Ratings & Reviews
- After using an item, users can leave reviews and rate the item, helping others assess the quality and condition of available items.

## Tech Stack

- **Frontend**: React + TypeScript for building an interactive, component-based user interface.
- **Backend**: Node.js and Express for handling API requests, user authentication, and booking functionality.
- **Database**: PostgreSQL for storing information about items, bookings, and users.
- **Authentication**: JWT for secure user login and controlled access.
- **File Storage**: imgbb.com for uploading and storing item photos.
- **Additional Features**: Push Notifications for alerts and optional integration with Google Calendar API.
