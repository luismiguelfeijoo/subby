# S U B B Y

An App that let's you track your clients subscriptions

The front is developed with React and the back is an Express.js server with socket.io for the chat and comunication.

<a href="https://subby-platform.herokuapp.com"><img width="200" alt="main-page" src="https://imgur.com/a/9OBFzM5"></a>

## What is S U B B Y

It's an app made for companies that sell monthly subscriptions!

You can create your company, clients and subscriptions to manage all of the economic information related to your service, but also it counts with a live chat so you and your clients can keep in touch in a much more professional enviroment.

The company can register their plans (monthly) and extras (daily) services to make ir more custom to the fit.


## How does it work

To create a company you just have to submit your email and your company name, later you will recieve an email with a link to confirm your subscription!

<img width="200" alt="new-company" src="https://imgur.com/a/9OBFzM5">

Every time you submit the creation of a new user we will generate a secure token to make sure their email is the one is submitted by the company. The creation of any client or local users are perform in similar manners as of the creation of the company.

### DataBase

The different collections are shown 👇🏻

#### Users

There are two types of users: Locals (managers or workers of the company) and Clients.

Their basic structure is shown here: 

Local

```
(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: {
      first: { type: String },
      last: { type: String },
    },
    type: {
      type: String,
      enum: ['admin', 'coordinator'],
    },
    company: { type: ObjectId, ref: 'company' },
  },
  {
    timestamps: true,
  }
);
```

Clients

```
(
  {
    username: { type: String, unique: true, required: true }, //email
    password: { type: String, required: true },
    name: {
      first: { type: String },
      last: { type: String },
    },
    subscriptions: [{ type: ObjectId, ref: 'subscription' }],
    company: { type: ObjectId, ref: 'company' },
    phone: { prefix: Number, phone: Number },
  },
  {
    timestamps: true,
  }
);
```

The client user have aditional fields to help the payment tracking!

#### Plans & Extras

Plan and extras are alike, they differ only where the times of money tracking comes in!

```
(
  {
    name: { type: String, required: true },
    company: { type: ObjectId, ref: 'company' },
    price: { price: { type: String, required: true }, currency: String },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);
```

#### Subscriptions

The subscriptions are directly linked to the clients, they are who recieve the plans and extras. Meanwhile the clients recieve subscriptions to make it easier to manage the info!

```
(
 {
    name: String,
    parents: [{ type: ObjectId, ref: 'clientUser' }],
    company: { type: ObjectId, ref: 'company' },
    plans: [
      {
        plan: { type: ObjectId, ref: 'plan' },
        startDate: { type: Date, default: Date.now },
        endDate: Date,
        charged: { type: Boolean, default: false },
        timesCharged: { type: Number, default: 0 }
      }
    ],
    extras: [
      {
        extra: { type: ObjectId, ref: 'extra' },
        date: { type: Date, default: Date.now },
        charged: { type: Boolean, default: false }
      }
    ],
    level: String,
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

```

### JWT (JSON Web Tokens)

The implementation of JWT has made possible the secure user creation and password reset.


## TODO (More work in the future 💪🏻)

* Make a global static of the company

All of the ideas are welcome!

## License

Please refer to [LICENSE.md](https://github.com/ironprojects-webmadpt1019/bike-control/blob/master/LICENSE.md)

## Contributing

If you want to contribute to this project, please refer to [CONTRIBUTING.md](https://github.com/ironprojects-webmadpt1019/bike-control/blob/master/CONTRIBUTING.md)

## Team

<div><p>Author: <a href="https://github.com/luismiguelfeijoo">Luis Miguel Feijoo</a></p></div>
