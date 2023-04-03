# **Contributing Guidelines** 

Please read our Code of Conduct and our Contribution Guidelines before you begin contributing, Thank you.

### **Code of Conduct**

Here at Elva, As contributors and maintainers of this project, we pledge to respect and appreciate everyone who contributes by reporting bugs, posting feature requests, updating documentation, submitting pull requests or patches, and participating in other activities.

We are dedicated to making participation free of harassment, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

---
 ## **Guidelines** 
1. We should be willing to welcome
change
2. We should be able to deliver
frequently
3. We should work together with trust
and support
4. We should be able to talk to each
other with respect
5. We should have a working software
6. We should maintain simplicity in
product delivery
7. We should be able to self-organize
8. We should always reflect and adjust
9. Our end goal should always be
sustainable development
10. We should aim to satisfy our end
users
11. We should pay continuous attention
to solving problems
12. We should be open to collaborations
amongst and within teams towards the
growth and evolution of Elva.
---


Actions and/or Behaviours which are absolutely prohibited and will be properly enforced against are as follows:
1. Sexualized language or imagery, as well as sexual attention or advances of any kind
2. Trolling, derogatory or insulting remarks, and personal or political attacks
3. Harassment, public or private Publishing others' private information, such as a physical or email address, without their express permission
4. Other behavior that could be considered inappropriate in a professional setting

### **Enforcement**

---

Any team member who by virtue of position acts outside of their
given powers wherewith, the effects of which demoralizes any
member directly, shall receive a query and be required to respond
to the said query within 24 hours. The offender shall also be required
to issue an apology along with the query response and said apology
shall be forwarded to the offended team member.

Team members are to report instances of abuse of powers to the
Admin department and trust that such matters will be handled with
utmost care and discretion.

Team members can reach out to the Admins privately or respond to
an open feedback form that will be made available.

--- 

# **How to Contribute**
1. Fork the repository
2. Create a new branch for your contribution
3. Follow the naming conventions
4. Make your changes in the new branch
5. Test your code
6. Commit your changes with clear and understandable commit message
7. Push your changes
8. Submit a PR


# **Pull Request Guidelines**
1. Name your Pull Requests very explicitly. It should properly articulate what the changes are because this helps the code reviwers understand what the PR is about
2. In the case that your PR introduces a new **feature**, It should be named as 
```
FEAT/name of implementation
```
This makes it easier to find PRs relating to the addition of new features. For clarity's sake, please also include a screen recording of how this new feature works.

3. In the case that your PR fixes a bug, please name it

```
BUG/name of implementation
```
4. Include tests for any new functionality and make sure changes do not break any  existing functionality

5. Before submitting the PR, ensure that all tests pass and if you are confused about any part of the process, please immediately reach out to a maintainer

---



# **Pull Request Template**
Add this PR template to (Your Project Base).github
## Description

Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context. List any dependencies that are required for this change.

Fixes # (issue)

## Major Changes
- [ ] Added Package
- [ ] Removed Package

## Linear Ticket
- [ ] Does this PR address a linear issue ticket?
- _If yes, provide the ticket ID in this space..._

## Type of change
- [ ] Fix (non-breaking change which fixes an issue)
- [ ] Feat (non-breaking change which adds functionality)
- [ ] Breaking change (Add a ! to Fix/Feat) (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update


## Preview
- All PRs that include new features should have video/screenshots of how said feature works present in the PR
- [ ] Has this been accomplished?
- Provide a link of the Project design used below
- [ ] Has this been accomplished?


## Checklist:

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] All dependencies used have been well documented on PR
- [ ] I have checked my code and corrected any misspellings

----

## **Naming Conventions** 

Please make use of the camel case naming convention when contributing code to this project. This means that variables ( including compound words ), classes and functions should be written in camel case, with the first word lowercase and each subsequent word capitalized. For example:

```js
# Correct
let passwordUtils = require('../lib/passwordUtils');
function getProduct()

# Wrong
let password_Utils = require('../lib/passwordUtils');
function Get_product()
```

The only expection to this rule should be in the definition of columns which have a compound name in a database model. In this case, make use of the snake case naming convention <br>
For example: 

```js
const {Sequelize, DataTypes} = require('sequelize')
const sequelize = new Sequelize()

const transaction = sequelize.define('transaction', {
    👉 bank_account: {
        type : DataTypes.INTEGER
    },

     👉 transaction_amount: {
        type : DataTypes.INTEGER
    }
})
```

This naming convention aids in the consistency and readability of our code.


