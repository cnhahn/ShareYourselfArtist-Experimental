# What are these files?
These files are copies of functions that are hosted on AWS Lambda. In order to test these functions, 
you will need to test them directly on the AWS lambda console (for non http functions) or by invoking
the function using Postman, Axios, etc in the case that it is a http function.

# How to create a lamdba function that can communicate with Firebase
In order to communicate with Firebase resources like Firestore and Storage you will need to import
the firebase SDK and initialize the application using the projects config (apiKey, authDomain, etc.).

To be continued...