Basically i have used "role" as a attribute for each user (admin/enduser) in d/b.

These are simple apis to acheive auth system.

### If you want to add a layer of security to registration api you should handle roles on the backend rather than sending them via frontend.

I have utilised jwt for generating auth tokens to handle login so with each get/post request to a protected resource the token is sent via auth headers to check if the user has authorisation to perform the particular task

## how does this work
- user signs up
- user logins to the system
- system gives user a auth token 
- user wants to delete user (admin's task)
- user sends request to delete a user 
- auth token sent
- auth.js starts to work - user not authorised 
- terminates

### Flow 
- request - auth.js - next
