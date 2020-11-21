const { Order, CartItem } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.orderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.order = order;
      next();
    });
};

exports.create = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    const emailDataToAdmin = {
      to: ['ashton@seibel.life', 'kangaroo@deerhartdesigns.com'],
      from: 'no-reply@deerhartdesigns.com',
      subject: 'A New Order from Deerhart Designs!',
      html:`
          <h1> Hey there! Someone just placed a new order on Deerhart Designs!</h1>
          <h2>Transaction ID: ${order.transaction_id}</h2>
          <h2>Customer Name: ${order.user.name}</h2>
          <h2>Deliver Address: ${order.address}</h2>
          <h2>Total # of Products: ${order.products.length}</h2>
          <h2>Total Sale Amount: $${order.amount / 100}.00</h2>
          <h2>Product Details:</h2>
          <hr />
    ${
      order.products
      .map(p => {
        return `<div>
                <h3>Product Name: ${p.name}</h3>
                <h3>Product Price: ${p.price}</h3>
                <h3>Product Quantity: ${p.count}</h3>
              </div>`
      })
      .join('--------------------------------')
    }
    <h3>Please login to the admin dashboard to see further order details, and to update the order status as needed.</h3>`
  }

    sgMail
      .send(emailDataToAdmin)
      .then(sent => console.log("Admin Email Sent =>", sent))
      .catch(err => console.log("No Admin Email Sent Due to This Error => ", err, err.request.body))
    
    const emailDataToCustomer = {
      to: order.user.email,
      from: 'no-reply@deerhartdesigns.com',
      subject: 'Your Order From Deerhart Designs',
      html:`
          <h1>Hey there, ${order.user.name}! Thanks so much for your recent order from Deerhart Designs! This email serves as a confirmation that we've received your order and are beginning to process it now! Please be on the lookout for tracking information, should we be able to provide such! If you have any questions please email us at kangaroo@deerhartdesigns.com, and we will get back to you as soon as possible!</h1>
          <h2>Total Number of Products in Order: ${order.products.length}</h2>
          <h2>Order Amount: $${order.amount / 100}.00</h2>
          <h2>Transaction ID: ${order.transaction_id}</h2>
          <h2>Current Order Status: ${order.status}</h2>
          <h2>Product Details:</h2>
          <hr />
          ${order.products.map(p => {
            return `<div>
              <h3>Product Name: ${p.name}</h3>
              <h3>Product Price: ${p.price}</h3>
              <h3>Product Quantity: ${p.count}</h3>
            </div>`
          })
            .join('--------------------------------------')}
          <h2>Thanks again for supporting our small business! You're helping make this artists' dreams come true!</h2>`
    };

    sgMail
      .send(emailDataToCustomer)
    .then(sent => console.log("Customer Email Sent =>", sent))
      .catch(err => console.log("No Customer Email Sent Due to This Error => ", err))
    
    res.json(data);
  });
};

exports.listOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name address")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(orders);
    });
};

exports.getStatusValues = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(order);
    }
  );
};
