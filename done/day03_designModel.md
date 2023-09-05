
![[Pasted image 20230830092512.png]]
## OOAD Workflows
requirements->analyse Model->Design Model

->requirements=user case diagram,use case description
->begin analyse Model= sequence(collaboration) and class diagram
->begin design Model= 


user case diagram is same as user story,sometime u can only choose one.
non-functional requirement: security some perfromance... it actually affected by the adesin model
boundry objs are not interface

## modele desgin

Platform specific
not only logic design
![[Pasted image 20230830140940.png]]
### Transition Strategies
From Anaylse Model to Design Model
1. Programming Language
2. Distributed System
3. Persistence

### 3. Persistence Obj
Entity objects are potential candidates of persistent objects(saved in db)
- sometimes entity maybe just be a passing obj between controller objs

Mapping from Object Model to Relational Model
- Adjusting objects to access database
- normally ER diagram,Data Dictionary


---
Use case controller performing database operation -> Not recommended!
- Adopt the simple DAO pattern to communicate with persistence storage
- DTO 用于在不同的层（如应用层、业务逻辑层、表示层等）之间传输数据，
- DAO 封装了与数据库交互的细节，提供了一种抽象的接口

### DAO
- conain all collective behaviors(like a list obj)
- contain the persistence related behaviours

CREATE flow
1. interface create a record OBJ
2. interface call controller
3. controller call DAO
4. DAO get the record OBJ
5. DAO store

---
failover provision 故障转移

