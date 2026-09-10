8 september:
- During mutual voice call writing boilerplate code such as creating directories and basic imports, on Alma's machine.

9 september:
- Create User table in MongoDB.
- Write User model from scratch, using private practice repository and study material as reference.
- Write user authentication controller from scratch, including "checkAuthintication", "login", "logout", and "register". Using private practice repository and study material as reference.
- Write routes for said user authentication controllers.
- Write "checkAdmin" middleware that gatekeeps unauthenticated visitors and authenticated users who does not have admin priviledges. Study material provided "verifyToken" were heavily referenced. Note: "decodedToken" is currently casted as "any", due to current limited techincal knowledge.
- Write edit user with check admin middleware, where only an admin may edit existing users. Attempt to allow owner to edit themselves were made, though that wasn't implemented due to current limited technical knowledge. Note: an admin can lock themselves out from priviledges.
- Write delete user with check adming middleware, where only an admin may delete existing users.

10 september:
- Begin writing the client side and restructure its codebase to our taste. Architecture may be changed according to how our taste changes.
- Write an app level initializer and check of auth status. Boolean determine what's displayed on page.
- Write app level authentication checker and authentication page that responds to authentication status. Render different content depending on authentication status.