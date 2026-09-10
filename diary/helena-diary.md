## 8 sept 

### Group meeting 

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

### Meeting Alma/Helena

- Reading and discussing assignment in more detail
- Call with Sibar to clarify assignment details
- Set up of basic structure (Controllers, Models, Routes, Import/Export, app.use)

### Helena

- Individual project planning
- Research tables and bootstrap

## 9 sept 

### Group meeting

Weekly plan:
- Wednesday - Individual coding - reach out on teams if needed
- Thursday - Class - catch up after (merge depending on progress)
- Friday - Class? - Group catch up

### Helena

- Discussing books and reviews with Sandra
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
- added GET all books and GET book by ID in bookController  (prepared for inserting reviews)
- added book routes and connected them in index.ts
- smaller clean up in index.ts to get all imports at the top for better structure (liase with group in next catch up)
- had an error connection with the server - did some error checks and made sure MONGODB_URL was correct
- Tested both GET requests in Insmonia (both tests succesfuL, yey!)
- Committed in Branch (did not want to commit until all files were correctly connected and I knew the code worked with Insomnia) 

  
