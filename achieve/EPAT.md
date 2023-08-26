# agile
meanning:: mindset that give ability
why:: project require changes
origin of agile : plan->do->study->act
## 4 period of agile
1 mindset -> 4 values ->12 principles -> unlimited practices
### agile mindset
agile mindset = Growth Mindset+ law of custormer,small team,network
growth mindset = embrace challenges,learn from criticism...

### manifesto:4 values
- interaction>tools processes
- working software>doc
- customers collaboration>contract negotiation
- respond to changes>plan

### 12 principles

#### interaction>tools
- 4. Business people and developers must work together daily throughout the project.
- 6. face to face conservation efficient
#### working software>doc
- 3. Deliver working software frequently
- 7. Working software is the primary measure of progress. 
#### customers collaboration>contract
- 1. Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.
#### respond to changes>plan
- 2. Welcome changing requirements, even late in development.
- 9. Continuous attention to technical excellence and good design enhances agility.
- 12. At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.
#### hero team
5. Build projects around motivated individuals. 
8. Agile processes promote sustainable development,all members maintain a  constant pace indefinitely.
11. best from self-organized
#### other
9. continuous attention to technical
10.simplicity art


### sprint
duration:: 1-4weeks 
product:: deliver some value
benefit:: engage customer

## small team
less 10
cross function
self organized


# Scrum 3role,5events,3product
### 3 role
developer, srum master, product owner
### 5 events: 
- Sprint,
- Sprint Planning, 
- Daily Scrum, 
- Sprint Review =》目的是回顾过去的工作成果，与**利益相关者**一起讨论和评估。
- Sprint Retrospective.=>目的是回顾过去的Sprint
### 3 output
product backlog =>product goal • product backlog are Owned by the Product Owner
sprint backlog =>sprint goal
product increment =>definition of done is decided by PO and Team agree on what does it mean by DONE

## different from waterfall
self-organized instead own by PM
Continuous review
Promotes single user rep as Product Owner
most teams adopt XP technical practices
# Extreme Programming (XP)
emphasis small release, adaptive and  iterative
Use metaphor to have common language between customer and development team
share responsibility Collective Ownership
sustainable pace

## XP vs. Waterfall Model
frequent releast=>
- have re-prioritization
- ,believe emergent design

# XP vs scrum
XP prescribes some technical practices 
- pair programming 
- code standard 
- testing
- refactoring
Scrum prescribe the process of development
# Pair programming
1 driver  1 navigator switched periodically
- not a must for agile project
- only worth for complex code, not rote code
- work 15-30min with small breaks
## Pair programming include
- Pair Analysis and Pair Design
- Pair implementation
- Pair Testing
## strong style
idea from you head must go through other's hand
## Ping Pong Style
1. P1 writes a failing test,
2. P2 take keyboard, makes the test pass
3. P2 writes a failing test,
## Pair Challenges
- partner excess ego or too little ego
- Support from stakeholder
- out of comfort zoon
## when Pair
- Code that involves design decisions
- Complex code
- 

# TDD
A programming practice
- writenew code only if an automated test has failed
- to eliminate duplication
- using Test First and Automation to guide the coding process
The goal of TDD is ‘clean code that works’，
## WHY TDD
Enable sustainable growth

## TDD Cycle
- red：a failingtest
- green: implement code
- refractor:improve design
## TDD Challenge
test management
stakeholders Support
some are difficult to test
## Test fixture
Test fixtures are objects that tests run against
Test fixture 是指在测试过程中所需的准备工作，用于确保测试的可重复性和一致性
### why fixture need set up
fixture Need to remain in a known, fixed state，Often use up resources
Therefore, often need to be set up before the test and taken down afterwards
## Test Doubles
“Pretend” objects used in place of real objects
Testest doubles（测试替身）是一种用于模拟或替代系统中的其他对象的技术。
Test Doubles Also called Fake Objects
### Test doubles type
- Dummy（哑对象）：占位符对象，没有实际的实现，通常被用作方法的参数
- Stub（存根）：具有预定义行为的对象，通常会返回预先定义的值
- Spy（间谍）：特殊的存根对象，除了返回预定义的值之外，还可以记录如方法的调用次数、参数等。并在测试中assert 这些次数
- Mock（模拟对象）：更高级的间谍对象，可以预先定义方法的行为，并在测试中进行断言以验证代码的行为是否符合预期。
- 与存根和间谍不同，模拟对象通常会对方法的调用顺序和参数进行严格的验证。
## Test Levels
unit(isolation)  
integration (components interaction ) 
system(whole,usually done to test software quality attributes)
## Test Plan
test plan is a detailed document which describes software testing areas and activities
## Test Best practice
test independent of each others
Mock out all external services and state
Keep the DRY principle
meaningful name and description
Run all tests every time you modify code and every build
## Integrating tests into build
Automated testing can be integrated into build process
Allow testing to be done every buil
Testing time should not be a hindrance to development flow

## Other
in agile, automotion is key of test
Black Box,Just built around specs and requirements
# Software Architecture
 fundamental structure of a software system,including 
 - Components:how they organized 
 - Communication
 - Constraints
not Only architects are responsible for the software architecture.
## Architecture in agile
build architecture  gradually by a chain of small refactoring
- see architecture as Big Up-Front Design      against the  effort and documentation
- a metaphor would suffice in most cases     
## Agile Software Architecture
supports changes,comprehension

## Characteristics of agile SA
Don’t “craft a new architecture”

## Agile Architecture Lifecycle
Initial requirement and Architectural(before sprint) and modeling
- keep simple
develop
communite stakeholder
refine
## Agile Modeling
not to heavy,detailed
## Agile Design
evolves
focus on the current structure of the system
### SOlID 原则
- 单一职责原则（Single Responsibility Principle，SRP）：一个类应该只有一个引起它变化的原因。同时修改一个责任不会影响其他责任。
- 开放封闭原则（Open-Closed Principle，OCP）：可扩展的，但不可修改的。
- 里氏替换原则（Liskov Substitution Principle，LSP）：子类应该能够替代其基类
- 接口隔离原则（Interface Segregation Principle，ISP）：一个类不应该强迫实现它用不到的接口方法
- 依赖倒置原则（Dependency Inversion Principle，DIP）：高层模块不应该依赖于低层模块，应该使用抽象接口。这样能解耦高层和低层组件之间的依赖关系
	- 比如只用接口INoitfy的 send，而不是用mailNotify和phoneNotify的 send
	- 这样减少了 coupling，方便增加更多 Notify class
	- 
# refractor
a technique used to ‘clean up’ messy code
## node to refractor 
• When the tests are NOT passing
• When we have impending deadlines
## Code Smells
a sign that a closer look is warranted
doesn’t always indicate a problem
## common code smells
common
- long method
- long parameter
- dead code 
- dublicate code 
Conditional Complexit
	:use strategy mode
Data Clump：use class

Feature Envy: 
	- a method that seems more interested in a class other than the one it's actually in.
Refused Bequest: 
	inheriting code you don't want.
# user story

User story makes up Product Backlog（main representation of the user requirement）

## who what why
who: not user but more precise,acurate like  adult user
3C => card conversation confirmation
##  Given-When-Then
The Given-When-Then formula is a template intended to guide the writing of acceptance tests for a User Story:
(Given) pre condition
(When) some action is carried out
(Then) expected output

## user story responsible
Product Owner is responsible to ensure that User Stories are written. 
However, it is best that the team writes the user stories:(PO can reject them)
- PO responsible,Master teach.

## good user story
small: 
- Independent
- Negotiable: need to be negotiable not to precise
- Valuable
- Estimatable
- small: can be done in a sprint; big can be reduced by crud
- Testable



## VUCA
- stands for volatility, uncertainty, complexity, and ambiguity. 
It describes the situation of constant, unpredictable change that is now the norm in certain industries and areas of the business world.