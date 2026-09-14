# Alma Diary
- [AI disclosure](#ai-disclosure)
- [Daily progress documentation](#daily-progress-documentaiton)


## AI Disclosure
In the era of artificial intelligence and LLM:s, I remain committed to disclose my own use of AI for this codebase. This disclosure cover the code I have written but does not represent the whole codebase. Chatbots, specifically Claude may have been involved as a documentation lookup tool, when tranditional documentation and forums fail to provide the answers needed, or to spot bugs I failed to detect. However, my use of Claude have been minimal, and no line of code is AI-generated or implemented without fully understanding.

## Daily progress documentaiton
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
- Redirect user to homepage after valid authentication (login or logout). Also display error messages if authentication input is invalid, such as wrong password or nonexisting username;
- Write admin panel page that rejets unauthenticated users and users who don't have admin priviledges.
- Write registration page, seperate from authenticate page for better management. Failed registration display error message, successful registration login and redirect to landing page.
- Write admin users panel with functionality to edit users. Progress isn't complete, and its current structure turned out more messy and hard to read than I'd hoped. It is still functional however, and I'm proud I was able to achieve it without any help of Claude (except spotting a couple of typos), so cleaning it up is not a priority.

13 september:
- Write notification view for admin user management panel.
- Rewrite admin users to fulfill the requirement of letting anyone browse existing accounts, while keeping the already written work of full CRUD operations, some elements are gatekept from non-admins.
- Write delete functionality. NOTE: Rough around the corners; A page refresh after performing deletion recognize the admin as non-admin until refreshing one more time; Deleting one's own account, then attempting to delete another return a 404 error. Patching these flaws are not prioritized as they're not considered important for the scope of this assignment and does not affect the overall functionality.