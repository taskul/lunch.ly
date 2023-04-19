/** Customer for Lunchly */

const db = require("../db");
const Reservation = require("./reservation");

/** Customer of the restaurant. */

class Customer {
  constructor({ id, firstName, lastName, phone, notes }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.notes = notes;
    this.fullName = `${this.lastName} ${this.firstName}`;
    this.numReservations = 0;
  }

  /** find all customers. */

  static async all() {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         last_name AS "lastName", 
         phone, 
         notes
       FROM customers
       ORDER BY last_name, first_name`
    );
    return results.rows.map(c => new Customer(c));
  }

  /** get a customer by ID. */

  static async get(id) {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         last_name AS "lastName", 
         phone, 
         notes 
        FROM customers WHERE id = $1`,
      [id]
    );

    const customer = results.rows[0];

    if (customer === undefined) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return new Customer(customer);
  }

  // find customer using last name
  static async find(lastName) {
    const results = await db.query(
      `SELECT id, 
      first_name AS "firstName",  
      last_name AS "lastName",  
      phone, notes 
      FROM customers
      WHERE last_name ILIKE $1
      ORDER BY last_name`,
      [lastName+"%"]
      );
    return results.rows.map(r => new Customer(r));
  }

  static async getTopTen() {
    const results = await db.query(
      `SELECT customers.id AS id, 
      customers.first_name AS "firstName", 
      customers.last_name AS "lastName", 
      customers.phone AS "phone", 
      customers.notes AS "notes", 
      COUNT(reservations.id) AS reservation_count 
      FROM customers 
      JOIN reservations ON customers.id = reservations.customer_id 
      GROUP BY customers.id 
      ORDER BY reservation_count DESC LIMIT 10;
      `);
    return results.rows.map(r => {new Customer(r), r.reservation_count})
  }


  /** get all reservations for this customer. */

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }

  /** save this customer. */

  async save() {
    // save when we are creating a new customer
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO customers (first_name, last_name, phone, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
        [this.firstName, this.lastName, this.phone, this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      // save when we are editing existing customer
      await db.query(
        `UPDATE customers SET first_name=$1, last_name=$2, phone=$3, notes=$4
             WHERE id=$5`,
        [this.firstName, this.lastName, this.phone, this.notes, this.id]
      );
    }
  }

}

module.exports = Customer;
