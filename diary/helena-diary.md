## 8 sept 

### GROUP MEETING - PLANING & INSTALLATION

- Set up of Github repo
- Initiating project
- Installations
- Set up of database in MongoDB
- .env file MongoDB_URL
- Dividing responsibilities (Alma 1, Helena 2, Samdra 3)
- Planning of project

 Basic planning/ ways of working: 
- Regular catch up meetings where we can compare code and merge together
- Joint set up, after work in individual branches

### Meeting Alma/Helena - Code set up

- Reading and discussing assignment in more detail
- Call with Sibar to clarify assignment details
- Set up of basic structure (Controllers, Models, Routes, Import/Export, app.use)

### Helena

- Individual project planning
- Research tables and bootstrap

## 9 sept 

### GROUP MEETING - PLANNING

Weekly plan:
- Wednesday - Individual coding - reach out on teams if needed
- Thursday - Class - catch up after (merge depending on progress)
- Friday - Class? - Group catch up

### Discussion Sandra/Helena

- Discussing books and reviews with Sandra

### Helena
- Set up of mockdata in MongoDB compass 
  
  insertMany()
  {
    title: "title",
    description: "Description.",
    author: "author",
    genres: ["genre", "genre"],
    image: "/images/jpg",
    published_year: 123
  },
  {....}

- added book schema in models
- added GET all books and GET book by ID in bookController (prepared for inserting reviews)
- added book routes and connected them in index.ts
- smaller clean up in index.ts to get all imports at the top for better structure (liase with group in next catch up)
- had an error connection with the server - did some error checks and made sure MONGODB_URL was correct
- Tested both GET requests in Insmonia (both tests succesfuL, yey!)
- Committed in Branch (did not want to commit until all files were correctly connected and I knew the code worked with Insomnia)

## 10 sept

### Meeting Alma/Helena
- Planning meeting with Alma - merged our branches to main together

### Helena

- Implemented POST to create book with required field validation and genre string → array handling and added verifyToken to route
- Created a re-useable function for POST and PATCH to handle arrays in genres
- Merged latest changes from main into my branch after starting from the wrong base.
- Implemented PATCH TO update a book by ID with optional fields and reused genre formatting function
- Added admin protection for update and delete operations using checkAdmin middleware
- Implemented DELETE /books/:id and added and prepared to be able to delete related reviews with a book once the reviews model is finalised.

## 11 sept

### GROUP MEETING - PLANNING CLIENT & CODING

- Update on progress
- Discussing Client Structure and html pages set up . Admin - to create/update/delete book or user. User - to create reviews (admin to update or delete)
- Setting up gloabls.js (check if admin, check if user, update navigation bar if logged in our logged out)
- adding the required files to work in as discussed

### Helena 

- check Insomnia (couldn't test without username and password) got info from Alma - testing succesful
- Build frontend to display books on index.html. Added imgage and button aligned to the left and title with details on the right
- Added bootstrap for layout and basic styling and added some extra styling in CSS to get desired look and layout

## 14 sept 

### GROUP MEETING

- Merging branches and discussed project details

### Helena 




  
