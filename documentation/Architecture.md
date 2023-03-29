# ARCHITECTURE
In this section, we shall talk about the architecture of the MindSpa system

The MindSpa Backend is built with the N-Tier Architecture, also called the Multi-tier architecture. Software that is built using this follows a multi-layered client-server architecture which has it's layers/tiers physically split into their own separate entities. 

These tiers are as follows:
* Presentation tier
* Logic/Service tier
* Data/Repository tier



#### ARCHITECTURE REPRESENTATION *via Wikimedia commons* 
--- 
![NTIER ARCHITECTURE](https://stackify.com/wp-content/uploads/2017/05/N-Tier-Architecture-min.png) 

---
## Presentation Tier
This tier is solely responsible for the presentation of information to the user in an easily understandable format. It serves as the interface between the user and the software itself.

## Logic / Service Tier
The Logic tier sits between the Presentation tier and Data tier. All processing tasks, including command executions, handling of errors, calculations, and other logical decisions, are handled by the logic tier, It transfers and analyzes data between the two layers that surround it.

## Data / Repository Tier
The data tier manages all communication to and from the data storage, which is the database. The data is subsequently returned to the logic tier for processing before being eventually returned to the presentation tier.

---

#### SIMPLIFIED REPRESENTATION *via baeldung.cs* 

![SIMPLIFIED ARCHITECTURE](https://www.baeldung.com/wp-content/uploads/sites/4/2022/01/ntier_usecase.drawio.svg)

### REASONS FOR IMPLEMENTING THIS ARCHITECTURE 

---
#### **Maintainability** :  Because each tier is physically and logically separated into their own components, it becomes very easily to maintain each of them without necessarily affecting the others.

#### **Scalability** : It becomes easy to upgrade one component without compromising the performance or functioning of the other components thanks to the architecture's isolation of individual components.

#### **Reusability** : Each tier of the software can be easily reused for other projects because it is separated into distinct tiers. For instance,we can simply duplicate the logic and presentation layers and then construct a new data tier if we wish to utilize the same application with a different set of data.

#### **Security** : The N-tier architecture provides increased security since each tier can be guarded with the appropriate security privileges as needed

---