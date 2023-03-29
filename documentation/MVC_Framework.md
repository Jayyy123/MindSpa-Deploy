## MVC Framework
In this section, The framework used will be discussed

The MVC Framework stands for the Model-View-Controller framework. This framework pattern separates software into 
- The Model
- The Service
- The Controller

**_Disclaimer:The service will serve as the view_**

![Model](https://media.geeksforgeeks.org/wp-content/uploads/20220224160807/Model1.png) <br>
_via geeksforgeeks.org_


## Model

All the data-related logic that the user deals with is represented by the Model component. This can be used to represent any data relating to business logic or the data that is being moved between the View and Controller components.<br> _For example, A **Transaction model** could be defined as so_:
```js
const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(DB_CONFIG.DB_NAME, DB_CONFIG.DB_ADMIN_NAME, DB_CONFIG.DB_PASSWORD, DB_CONFIG.DB_EXTRA_CONFIG)

const Transaction = sequelize.define('transaction', {
    id : {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },

    depositor_name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    transaction_amount: {
        type : DataTypes.INTEGER,
        allowNull: false
    }
})
module.exports = Transaction
```

## View

The software's entire UI functionality is implemented in the View component. For the user, it creates an interface. The data that the Model component collects is what fuels views, but the data aren't taken directly; rather, they go through the controller. The controller is the only thing it talks to. <br> 
For example, A view rendered for the creation of a transaction can be as such: 

## Controller
The controller functions as an intermediary by enabling the link between the View and the Model. The controller only needs to instruct the model. It processes all incoming requests and business logic, works with the View component to communicate, and uses the Model component to alter data. <br>
_For example, A createTransaction controller will handle all activity coming from the createTransaction view and create a transaction in the database by using the Transaction Model_

``` js
const transactionModel = require('./models/transactionModel')

const createATransaction =  (req, res) => {
    const {depositor_name, bank, transaction_amount} = req.body

    transactionModel.sync({alter: true})
    .then(() => {
       return transactionModel.create({
            depositor_name: depositor_name.toLowerCase(),
            bank: bank.toLowerCase(),
            transaction_amount:  transaction_amount.toLowerCase(),
        }, 
        {
            raw: true
        })
    })
    .then((data) => {
        console.log(data)
        res.redirect('/transactions-entry/success')
    })
    .catch((err) => {
        console.log(`An error occurred : ${err}`)
        res.redirect('/transactions-entry/error')
    })}

module.exports = createATransaction
```
--- 

### REASONS FOR IMPLEMENTING THIS FRAMEWORK

#### **Rapid Development** :  Since MVC splits the code into three parts. When designing web applications using the MVC approach, one developer can work on one section, such as the view, while another works on a different section, such as the controller, at the same time. This tier makes it easier to implement business logic and speeds up the development process.

#### **Support for Asynchronous Method Invocation** : The MVC pattern is JavaScript and frameworks compatible, and it supports Asynchronous Method Invocation (AMI). AMI enables developers to create faster-loading web applications. PDF files, site-specific browsers, and desktop widgets are all supported by MVC applications.

#### **SEO Friendly Framework** : MVC architecture can aid in the creation of SEO-friendly web pages and web applications. This development architecture is used in Test-Driven Development (TDD). 

---