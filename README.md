
# MindSpa's Backend Documentation 
This documentation contains the core features, concepts, procedures, design principles and the architecture of the Mindspa Backend.


## TABLE OF CONTENTS

1. [Architecture](#architecture)
2. [Design Principles](#principles)
3. [MVC Framework](#mvc-framework)
4. [Project Setup](#project-setup)


# ARCHITECTURE
Please refer to [Architecture](documentation/Architecture.md) for information on the architecture we are implementing

## PRINCIPLES
Two major principles will be strictly followed and applied during throughout the duration of this project which are: 
1. THE SOLID PRINCIPLE
2. THE DRY PRINCIPLE

**SOLID PRINCIPLE**: 
SOLID is an acronym for a set of five principles mainly
- Single Responsibility Principle
- Open-closed principle
- Liskov substitution principle
-  Interface segregation principle
- Dependency inversion principle

__Single Responsibility Principle:__ This principles states 
> A class should have one and only one reason to change, meaning that a class should have only one job.

**DRY PRINCIPLE**

DRY is an acronym which stands for Don't Repeat Yourself. This is a software development principle that tries to eliminate redundancy and reduce pattern recurrence and code duplication by using abstractions instead.

> _“every piece of knowledge must have a single, unambiguous, authoritative representation within a system.”_ - The Pragmatic Programmer

---



# MVC Framework
Please refer to [MVC Framework](documentation/MVC_Framework.md) for information on the framework we are implementing

<br>

# PROJECT SETUP

### Installation

_Follow these steps to setup the project locally on your computer_

1. Clone the repo
```
git clone https://github.com/ElvaTecnologies/Mind-Spa_backend.git
```

2. Install NPM Dependencies 
```
npm install
```
**_Note:_** If dependencies are deprecated at time of installation, then upgrade these packages by simplying running
```
npm audit fix --force
```

3. Create .env file <br>
When you clone this repository you will not have an env file because it would have been gitignored. Create yours and store the credentials. for example
```
DB_CONNECTION_STRING = sql/localhost:PORT//<username>:<password>@sqlurlhere
```

4. Start Project
```
npm start
```
