# lunch.ly

An example of building a mini-ORM that works with pg library and returns objects to the client when accessing resources

Lunchly is an Express app that is not an API server, nor is it RESTful.

Instead, it’s a server-side templated application with custom URLs.

## Structure: 
- models/customers.js - is a Customer class with static methods for 
	- getting all customers
	- getting customer by id
	- find customer by last name
	- get top ten customers
	- getReservations
	- save method for creating new customer or updating an existing customer
- models/reservations.js - is a Reservation class with static methods for 
	- getReservationsForCustomer
	- save method for creating new reservation or updating an existing reservation
- static - directory for CSS and front-end JavaScript files.
- templates - Jinja templates, rendered with the JS “Nunjucks” library
- app.js - manages routes
- config.js - manages connections to database based on test or development environment
- data.sql - is our database schema
- db.js - manages connection to databse using config.js and pg library
- expressError.js - custom error handler
- routes.js - handles all routes for customers and reservations that return an object
- routes.test.js - tests routes using Jest
- server.js - starts the server


