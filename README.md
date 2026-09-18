# Bookworm
Live link: https://api-assignment-2-eta.vercel.app

Table of contents
- [About](#about)
- [Developers](#developers)
- [Preview](#preview)
- [Technologies](#technologies)
- [Testdata](#testdata)
- [Technical Details](#technical-details)

## About
Bookworm is a directory of books, where visitors can browse books and read reviews. Any visitor can write their own reviews for other visitors to see. Bookworm also has an admin feature, where users with admin priviledges can create, edit and delete books and users. Non-admins cannot access the admin panels, as they're hidden. If the user somehow find themselves in an admin panel, the page will block content and redirect them back to the landing page after a countdown.

## Developers
- Helena Gustafsson
- Sandra Hellström
- Alma Isaksson

## Preview
Landing page
![Landing page screenshot](./readme-images//landing-page.png)

Register page
![Register page screenshot](./readme-images/register-page.png)

Logout page
![Logout page screenshot](./readme-images/logout-page.png)

Book detail
![Book detail page screenshot](./readme-images/book-detail.png)

Book detail write review
![Book detail write reveiew scresnshot](./readme-images/book-detail-review.png)

Admin panel
![Admin panel page screenshot](./readme-images/admin-page-panel.png)

Admin books manager
![Admin books manager page screenshot](./readme-images/admin-book-manager.png)

Admin books manager edit mode
![Admin books manager edit mode screenshot](./readme-images/admin-book-manager-edit-mode.png)

Admin users manager
![Admin users manager screenshot](./readme-images/admin-users-manager.png)

## Technologies
- TypeScript & Node
- Express
- Mongoose
- MongoDB
- HTML, JavaScript, CSS
- Github
- Vercel

## Testdata
Note: Test mock data can be found inside the MongoDB-json directory

## Technical Details

### Admin Authentication & Access Control

The admin book manager is protected by authentication and role‑based access.
Only logged‑in admin users can view, create, edit or delete books.
Non‑admins are blocked from the page, shown a clear error message, and automatically redirected after a short countdown to main page (index.html).

### Book Management (CRUD)
Admin users can manage books through a fully dynamic interface:

#### Create:

- All fields validated (title, author, description, genres, year, image)
- Inputs trimmed and normalized.
- Genres converted into a clean array.
- Published year validated as a number.
- Success message displayed, followed by a timed redirect back to the admin panel showing books.

#### Edit:

- All fields pre‑filled with backend data.
- Changes saved via a PATCH request
- Success message shown before returning to the admin panel with timer.

#### Delete:

- Delete actions require confirmation through a visible confirmation box.
- Smooth scroll ensures the box is visible.
- Success message displayed, followed by a timed reload of the book list.

#### Dynamic Rendering & UI Behavior
The admin interface is rendered dynamically with JavaScript:

- Book lists and forms generated using .map().join("").
- Dynamic button visibility: admin‑specific buttons such as Back to Panel and Create New Book are shown or hidden depending on whether the user is viewing, creating or editing a book.
- Responsive layout adapts images, tables, buttons and message boxes to screen size.
- Consistent design across all pages/views.

#### Validation & Data Normalization
To ensure consistent data quality:

- All text fields trimmed.
- Titles and descriptions capitalized.
- Authors and genres capitalize each word.
- Genres split and cleaned into arrays.
- Published year converted to a number before saving.

#### User Feedback & Error Handling
The admin system provides clear feedback for all actions:

- Error messages for invalid input, missing fields or failed API calls.
- Error message + redirect for unauthorized users.
- Success alerts for create, update and delete operations.
- Confirmation boxes for delete actions.
- Timeouts and redirects for improved user experience.
