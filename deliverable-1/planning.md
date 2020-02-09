# Team 3 - Matron
> _Note:_ This document is meant to evolve throughout the planning phase of your project.   That is, it makes sense for you commit regularly to this file while working on the project (especially edits/additions/deletions to the _Highlights_ section). Most importantly, it is a reflection of all the planning you work you've done in the first iteration. 
 > **This document will serve as a master plan between your team, your partner and your TA.**

## Product Details
 
#### Q1: What are you planning to build?

 > Short (1 - 2 min' read)
 * Start with a single sentence, high-level description of the product.
 * Be clear - Describe the problem you are solving in simple terms.
 * Be concrete. For example:
    * What are you planning to build? Is it a website, mobile app,
   browser extension, command-line app, etc.?      
    * When describing the problem/need, give concrete examples of common use cases.
    * Assume your the reader knows nothing about the problem domain and provide the necessary context. 
 * Focus on *what* your product does, and avoid discussing *how* you're going to implement it.      
   For example: This is not the time or the place to talk about which programming language and/or framework you are planning to use.
 * **Feel free (and very much encouraged) to include useful diagrams, mock-ups and/or links**.

Our project is to build a plugin which users can use to build a virtual blueprint and calculate the distance between any two rooms in a hospital wing.

The problem presented to us is that nurses in hospitals have a perceived increased workload based off of how much and how long they are required to walk to perform their duties. This in turn may increase stress, cause burnout and lower the quality of the work they perform, affecting their patients. Our job is to help minimize the amount of traveling a nurse is required to do in a given work day to prevent this from happening. Our partner has informed us that they currently have a scheduler which does not take into account the distances between each of the tasks it assigns, so the schedule may provide tasks in an order which causes excessive travelling.

With this information at hand, we are to design a plug-in for the existing scheduling software that the hospital administrator/interns are already using. This plugin will be used to create virtual blueprints of the hospital, which will then integrate with the existing scheduler to calculate the distance between parts of the hospital. These calculations will be used to generate more efficient schedules with less overall walking required, which will alleviate a large portion of the nurses' perceived workload. In addition, the virtual blueprint will be able to be edited to reflect periods of overcrowding in the hospital, for example when patients are forced to stay in the hallways.

In the end, our plug-in is to aid in their pre-existing scheduling software by providing the traveling distance to further optimize nurse schedules and increase overall quality of work by diminishing the effect of exhaustion caused by excessive walking.

#### Q2: Who are your target users?

  > Short (1 - 2 min' read max)
 * Be specific (e.g. a 'a third-year university student studying Computer Science' and not 'a student')
 * **Feel free (but not obligated) to use personas.         
   You can create your personas as part of this Markdown file, or add a link to an external site (for example, [Xtensio](https://xtensio.com/user-persona/)).**
   
The first type of user for our application is the hospital manager. This would be any hospital staff in an administrative position who's in charge of scheduling tasks for the other hospital staff. Their goal is to try and optimize nurse schedules as much as possible, which our product would help them achieve by allowing them to take distance into account when creating schedules.

The second type of user will be the interns employed by the hospital. They're job will be to translate the real, physical layout of the hospital into a virtual blueprint on our plugin. Before the hospital manager can benefit from optimized schedules, an intern will have to use the product to create virtual blueprints of the hospital to be used by the pathfinding system.

#### Q3: Why would your users choose your product? What are they using today to solve their problem/need?

> Short (1 - 2 min' read max)
 * We want you to "connect the dots" for us - Why does your product (as described in your answer to Q1) fits the needs of your users (as described in your answer to Q2)?
 * Explain the benefits of your product explicitly & clearly. For example:
    * Save users time (how much?)
    * Allow users to discover new information (which information? And, why couldn't they discover it before?)
    * Provide users with more accurate and/or informative data (what kind of data? Why is it useful to them?)
    * Does this application exist in another form? If so, how does your differ and provide value to the users?
    * How does this align with your partner's organization's values/mission/mandate?
    
There are many benefits to using this plugin, the main one being there is no existing software that currently replicates its functionality in a hospital environment. The existing scheduling system does not have any way to take distances into account at all, and is forced to build the Nurses' schedules solely from other factors. Our product will alleviate this by being able to provide the distance between any two rooms in the hospital, meaning that there will no longer be any inefficient schedules with too much walking.

In addition, there is also no easy way to digitally represent the physical layout of the hospital which is why factoring in distance when making schedules is currently so difficult. This will also be solved by our product by providing a clean and simple user interface for creating virtual blueprints of the hospital. They will be able to build it on top of existing blueprints, or completely from scratch for maximum ease of use and flexability.

Finally, integrating our plugin with their scheduling system will save the nurses large amounts of time which will directly translate to a lighter workoad and less stress. This will allow them to better aid their patients which directly helps the hospitals values of doing their best at helping their patients recover.

#### Q4: How will you build it?

> Short (1-2 min' read max)
 * What is the technology stack? Specify any and all languages, frameworks, libraries, PaaS products or tools. 
 * How will you deploy the application?
 * Describe the architecture - what are the high level components or patterns you will use? Diagrams are useful here. 
 * Will you be using third party applications or APIs? If so, what are they?
 * What is your testing strategy?
 
The plugin will be built using Python and Flask for the backend, and HTML5 and Javascript for the interactive frontend interface. We will also use Neo4J as our DBMS, which is a non-relation graph-based database and will be hosted on Heroku. We will also be using the D3 javascript library to create and render the graphs in the graph builder interface and use 3D-Force Graphs to automatically rescale them.

High level components of our project consists of:

The webserver, which the users will be directly interacting with. This webserver will be written with Flask and python and will be responsible for serving webpages, communicating with our database, and performing any logic such as pathfinding on the graph.

Database (Neo4J) : Responsible for storing blueprint image files, and past/current versions of each graph the user has made (for rollback purposes) and related metadata.

A pattern that we would like to use is the DOA (data access object that we discussed in class)

Our main testing method is unittest. We will also use continuous integration method. This is to say, we will perform code reviews and manually deploy the app onto Heroku to examine the app and look for any bugs which can be seen from the U.I. level. We will only deploy master-branch/working-app onto Heroku primarily for partner demonstration purposes after it has been thouroughly tested and received approval from the main tester.

#### Q5: What are the user stories that make up the MVP?

 * At least 5 user stories concerning the main features of the application - note that this can broken down further
 * You must follow proper user story format (as taught in lecture) ```As a <user of the app>, I want to <do something in the app> in order to <accomplish some goal>```
 * If you have a partner, these must be reviewed and accepted by them
 * The user stories should be written in Github and each one must have clear acceptance criteria.
 
 Tentative User Stories:
  - As a user of the Matron API, I want to see the distances between a given room and all other rooms of a given type (patientroom, supplyroom, workstation, etc.) so my scheduling software knows how best to plan a nurses day.
  - As a user of the Matron API, I want to be able to query the distance between any two known rooms so I can optimize a route that traverses a set of rooms.
  - As an intern, I want to upload hospital blueprints so I can use them as reference for building a correctly-scaled graph of my unit.
  - As an intern without access to my unit's blueprints, I want to visually construct a graph of my unit using nodes marked with room label/number/type and edges connecting them so that the system knows what routes we can walk.
  - As an intern, I want to click a button to save my graph once I'm done editing it so my hard work is not lost.
  - As an intern, I want to scroll through the history of my unit's graph so I can rollback/undo a bad edit.
  - As an intern with a badly drawn unit graph, I want to physically measure the time it takes to walk along the edges of my graph so that the system can rescale it to the correct proportions.
  - As an intern, I want to load and edit (add and remove nodes/labels and edges from) the graph of my unit to correct errors or let the system know of patients held in ad-hoc location.
  - As an intern, I want to be notified of obvious mistakes in my graph such as unlabelled rooms or inaccessible areas so I can correct them.
  - As an intern, I want to box-select multiple rooms/nodes in the graph and drag them around so I can more easily fix large multi-node scaling innaccuracies in my graph.
  - As an intern, I want to click on the graph editor to create a new node and type in its room number/label so system knows which physical room that node corresponds to.
  - As an intern, I want to set the type of a newly created node via a context-menu that lists the existing types (eg., patientroom, supplyroom, workstation) and has an option that allows me to add a new custom type via the keyboard.
  - As an intern, I want to click to open a pie menu to select the tool I'm currently using in the graph editor so I can quickly switch between adding nodes, box-selecting nodes, drawing edges, or editing room labels/numbers/types.
  - As a hospital manager, I want to open the graphs of multiple distinct hospital units and draw edges between them so the schedules of nurses working across multiple units can be optimized.
----

## Process Details

#### Q6: What are the roles & responsibilities on the team?

Describe the different roles on the team and the responsibilities associated with each role. 
 * Roles should reflect the structure of your team and be appropriate for your project. Not necessarily one role to one team member.

List each team member and:
 * A description of their role(s) and responsibilities including the components they'll work on and non-software related work
 * 3 technical strengths and weaknesses each (e.g. languages, frameworks, libraries, development methodologies, etc.)
 
Although all team members are experienced with computer science, and will be free to contribute wherever their skills are needed, the roles here reflect which components they'll be in charge of and mainly focusing on.
 
 
* **Saad: Project Manager and Team Lead**
  * *Responsibilities:*
    * Overall team organization, including managing Trello board, Discord server, and leading team meetings
    * Continually assess each team member and their assigned tasks, similar to a Scrum master type role
    * Review tasks and stories to make sure partner's requirements are met
    * Review project structure holistically and ensure overall backend/frontend integration
    * In charge of any ML and AI based techniques used in backend, as well as possibly advising on design of Flask backend 
  * *Strengths:*
    * Python and related libraries such as Flask, numpy/scipy, matplotlib
    * AI and ML including PyTorch, neural networks, and probabilistic techniques
    * Agile methodologies including Scrum and Kanban 
  * *Weaknesses:*
    * UI and frontend, including HTML/CSS and JS
    * mobile app development, such as Android apps in Java and iOS apps in Swift
    * unit testing and test-driven development
* **Kavosh: Partner liaison, Graph scaling manager, Graph-editor UX designer**
  * *Responsibilities:*
    * Communicate with partner
    * Audio record meetings and upload/share files with team
    * Work on the graph based map building UI
    * Build the blueprint-unassisted map rescaler
      * Create a page that instructors the user to go on a tour of the unit (the graph MST)
      * Instructors user to tap at the start and end of each leg of the tour
      * Uses the recorded time deltas to correct the scaling on an existing map graph  
  * *Strengths:*
    * Javascript/Java/Python
    * Computer graphics, OpenGL
    * Theoretical comp sci, graph theory/algorithms
  * *Weaknesses:*
    * Documenting code
    * Flask
    * noSQL databases
* **Adit: Front-end developer, UX designer**
  * *Responsibilities:*
    * Designing and implementing visual and interactive elements, in particular resposible for all pages except for the graph builder interface.
    * Deciding the look and layout of the web application
  * *Strengths:*
    * Front end development HTML, CSS, JS, and graphic design
    * Good experience with databases SQL and noSQL
    * Experience with web development with MERN stack, django, and flask
  * *Weaknesses:*
    * GIT merging conflicts
    * Infrequent activity of group project discord, as well low profiency with discord
    * No experience with development methodologies
* **Thomas: Back-end Routing, Cheerleader**
  * *Responsibilities:*
    * Handling routing of the information coming from the back-end 
    * Maintaining team morale and motivation
    * Creating test cases for back-end related routing and events
    * Debugging back-end related events
  * *Strengths:*
    * Experience with python, HTML, CSS, and JS.
    * Capable of handling flexible workloads and working on other parts of the project if required.
    * Thoroughly experienced with debugging personal and other individuals code.
  * *Weaknesses:*
    * Working with the foreign libraries and frameworks that will be used.
    * Handling GIT conflicts such as merging.
* **Ilan: Backend Logic Developer, Assistant Cheerleader**
  * *Responsibilities:*
    * Processing of data structures and back end logic
    * Ensuring correctness of product's algorithms
    * Debugging and creating test cases during development of back end logic
  * *Strengths:*
    * Strong experience in Python and OOP design patterns
    * Well-versed in data structures and algorithms to do with graph traversal and pathfinding
    * High standards for documentation and code cleanliness
  * *Weaknesses:*
    * Databases and web development
    * Advanced Git usage
    * Little experience in front end development
* **David: Database Manager**
  * *Responsibilities:*
    * Setting up and maintaining the product database
    * Creating the DAO for the project
    * Determining data structure design/representation
  * *Strengths:*
    * Database management (PostgreSQL and MongoDB)
    * Server implementation in node.js, flask
    * Python, Javascript
  * *Weaknesses:*
    * General front end design (HTML/CSS) and associated UI libraries (bootstrap, react, etc.)
    * Mobile development/programming (both android/iOS)
    * Testing and debugging
* **John: Tester and unittest assistant**
  * *Responsibilities:*
    * Writing unittests and making sure the unittests works for people who have already written it
    * Debugging if unittest does not work and refactoring
  * *Strengths:*
    * Able write in python, SQL, javascript, html/css.
    * Likes to test and debug code - (good ability to pay attention to details).
    * Experience in mobile android app development.
  * *Weaknesses:*
    * Overall little technical experience in web development.
    * Not much familiar with design patterns.
    * Not familiar with libraries used in front-end. 


#### Q7: What operational events will you have as a team?

Describe meetings (and other events) you are planning to have. 
 * When and where? Recurring or ad hoc? In-person or online?
 * What's the purpose of each meeting?
 * Other events could be coding sessions, code reviews, quick weekly sync meeting online, etc.
 * You must have at least 2 meetings with your project partner (if you have one). Describe them here:
   * What did you discuss during the meetings?
   * What were the outcomes of each meeting?
   * You must provide meeting minutes.
   * You must have a regular meeting schedule established by the second meeting.  
   
We plan to have team meetings once a week that all members are required to attend either in person or by call. Through a two-stage voting process we've decided on Thursday 5-6 as our regular meeting time, as it was the time that worked for 6/7 of our group members. For the group members who can't make it, they will call in using Discord so they can still contibute to group discussions. The location may change, but it will generally be a group study room booked in advance by the team lead - we've found that larger rooms with whiteboards and tv screens help us organize better.

The main purpose of the meetings will be to update the team on our progress so far, and share any questions or concerns that any team members have about the project. We plan to use a less strict organizational methodology like Kanban, so weekly meetings to check in and ensure we're on track will be necessary to keep us organized. The team lead will be responsible for keeping meeting minutes for all meetings in a dedicated channel on our Discord server.

We also have our meetings with our project partner. These will be biweekly and online via Skype, as per our partner's preference. Depending on our availabilites different amounts of the team may join, but we have a dedicated partner liason who will be the one to schedule the meetings and speak to the partner. If nobody else can join, the partner liason will be responsible for taking the group's concerns to the partner and bringing back information at the weekly team meetings.

The first meeting with our project partner was mainly to get everyone introduced to each other, and discuss the basics of his proposal. We mainly talked about the general idea about what he wanted to build, what existing software he's already using, and what kind of technology would be feasible for our project. Before this meeting, we were unsure of what kind of implementations we could move forward with, so this was extremely useful for us to help narrow down our options and have a more focused project. For example, we considered building an app that would be deployed to the nurses in the hospital, but the partner clarified the manager will integrate our app with the existing system to generate schedules and then disseminate the information to the nurses. We also established the meeting schedule and exchanged contact information.

The second meeting was conducted online before the due date of the first Deliverable. Here, we wanted to confirm all of our user stories and other product details we had written in the Deliverable. This meeting went quite quickly as the partner approved the majority of user stories we had come up, and the group had a good sense of the partner's goals of the product from the first meeting. As the group thinks of more user stories, the partner liason continually confirms them with the partner via email but so far they've all been approved other than minor changes.
  
#### Q8: What artifacts will you use to self-organize?

List/describe the artifacts you will produce in order to organize your team.       

 * Artifacts can be To-Do lists, Task boards, schedule(s), meeting minutes, etc.
 * We want to understand:
   * How do you keep track of what needs to get done?
   * How do you prioritize tasks?
   * How do tasks get assigned to team members?
   * How do you determine the status of work from inception to completion?
   
Our team's primary means of internal communication is via Discord. Our group's server has 5 total text channels split into two categories:

Organizational: There are three text channels under this category that are used to make team-wide announcements, post meeting minutes, and share important notes as they come up. The first two are restricted so that only the project manager may post announcements and meeting minutes, to keep irrelevant conversations out of the way and better disseminate information. The last one serves as more of a queue to deal with items as they come up, and issues here will then be moved to the appropriate place such as on the Trello board.

Production: Two text channels here are used for general chat and issue discussion when it requires the attention of some or all other team members. This server provides a quick means of instant messaging between the group while still organizing messages into unique and useful categories. There are also 4 voice chat rooms which our team members may join at any time. We have multiple voice chat rooms so that members may split off into pairs or small groups and work on issues/files together.

For team-wide announcements, we use Discord's emoji reaction feature to verify the all team members have read and concur with the announcement. For example, if the project lead announces that we are to hold a meeting on date X, all members who can make it react with a thumbs up emoji and those who can't react with a thumbs down emoji. This reduces clutter on the message board as reactions are tied to the announcement and don't show up as unique messages. If a member doesn't react within 24 hours, we assume they haven't seen the announcement and will make further attempts to reach them.

When any vote needs to be done, we have various methods of polling the group members. For voting on meeting times, we use a service called when2meet which is designed to help groups determine who is busy and when to find the optimal meeting times. If there are any ties, we use a regular vote to tiebreak the most popular choices; this is the same two stage voting process we used to determine our weekly meeting time. For regular votes, we use Google forms as it is the most powerful option, and has useful features such as allowing anonimity and filtering results. We previously used strawpoll for such things, but realized the built-in anonyimity made it difficult to tell who exactly wasn't free to meet at certain times.

Our team also has a Trello board where we use a modified form of Kanban. We post important information (To-do lists, pending tasks, documentation, etc.) here as well for everybody to see. Group members can see when one member takes on a specific task, as well as when it is ready for design, implementation, testing, and code review. We plan to use this board to facilitate a modified version of Kanban; we will pipeline our code and features on a Kanban board, but with the added oversight of a scrum master type role to keep all team members focused and on track. 

#### Q9: What are the rules regarding how your team works?

We plan to have a fairly open working culture, where each team member is given a task or role and has freedom to handle it however they see fit. We've divided the project into general roles such as frontend, backend, database, etc. and each member will oversee and do any research, design, and implementation on any area they're in charge of. We'll have weekly meetings and consistent communication on our Discord server to ensure team members are organized and completing their tasks, and the team lead will oversee the Trello board to keep the project on track. When they merge a pull request to the master branch, we will require 3 code reviews to ensure only quality code is commited and that each team member has a sense of the overall state of the project.

**Communications:**
 * What is the expected frequency? What methods/channels are appropriate? 
 * If you have a partner project, what is your process (in detail) for communicating with your partner?
 
Between group members, minimum of once a week because we have a weekly meetings. On average, we expect to speak with each other regarding the project about once every other day via our Discord server or in person. For emergencies, we've all shared our phone numbers with each other except for 1 group member who didn't consent. Our expected frequency of communications with the partner is biweekly, as per the partners preference, with a Skype call or via email for immediate requests. We have a dedicated partner liason who will be responsible for keeping the partner up to date on our progress and sending emails if we have any questions.

**Meetings:**
 * How are people held accountable for attending meetings, completing action items? Is there a moderator or process?
 
If a group member doesn't attend a meeting or complete an assigned action item, the team lead will contact them and ask for justification about why they didn't attend. We have various ways to contact each other if needed including our official Discord server, email, phone number, or just in person if needed. The team lead is willing to step in if needed, and in extreme cases the TA or course coordinators would be contacted to find a resolution. Since each team member has a distinct role, we take it seriously if they don't contribute since covering their workload would be quite difficult.
 
**Conflict Resolution:**
 * List at least three team scenarios/conflicts you discussed in lecture and how you decided you will resolve them. Indecisions? Non-responsive team members? Any other scenarios you can think of?

 * Team indicision:
      * In terms of development the first course of action would be to have a vote and see if there's a clear consensus. If not, then the team member(s) that are in charge of the implementation of the feature will have the final say in the design decision. If this is a decision we believe the partner would have insight on, we will contact them and they will have final say. This is because we believe that the person who has to actually code a feature should have more control over the specifications of that feature.
      * However, if we still cannot come to an agreement after we've thoroughly discussed all options we will leave it up to chance pick which one to choose.
   
 * Non-responsive team members:
     * If this were to occur, the plan is to attempt to contact the non-responsive team member; firstly via Discord and email, and then using their phone number and finding them in person. If this behavior were to continue for longer than 3 days, then we would contact our TA and course coordinator and let them know about this. 

 * Unproductive member: 
   Our policy can be broken down into two scenarios, based on the cause of the problem:
   * **Unforseen circumstances:** In this case, the member is unable to fully contribute due to factors outside of our control. It would be unfair to penalize them for this. The team member with the greatest amount of availability and knowledge of the unproductive member's responsibility will take on their work until the unproductive member is able to fully contribute to the project again.
   * **Just unproductive/unresponsive:** A team member who is just not doing their part will be handled as described before. We will first contact them normally, through Discord, email, phone, or in person. If this does not help, the team lead and course coordinators may get involved.
----
### Highlights

Specify 3 - 5 key decisions and/or insights that came up during your meetings
and/or collaborative process.

 * Short (5 min' read max)
 * Decisions can be related to the product and/or the team process.
    * Mention which alternatives you were considering.
    * Present the arguments for each alternative.
    * Explain why the option you decided on makes the most sense for your team/product/users.
 * Essentially, we want to understand how (and why) you ended up with your current product and process plan.
 * This section is useful for important information regarding your decision making process that may not necessarily fit in other sections. 
 
The first issue that repeatedly came up was how we would gather data about the distances between rooms when said information was not given or known by the users. We had a variety of options for how we would gather this data including gps tracking, accelerometer data (step counting), and time measurements from something like a stopwatch or timer. Each of these had their various pros and cons. For example, gps tracking would give the most accurate distance information under ideal conditions but might be completely unfeasible deep inside large buildings (like a hospital). Accelerometer data is still fairly accurate to a degree and would not depend on the gps quality but would require some averaging to account for different peoples' strides. Time is the simplest metric and would not require use of seperate hardware such as a gps unit or accelerometer. Ultimately, we decided on using time as the distance metric since 1. we wouldn't need to implement a mobile solution to gather the distance information 2. It would be able to account for additional factors like hallway traffic. 3. It's less dependant on external factors such as gps and accelerometer quality. 

Another issue that came up was what choice of database we would use to store our data. Our options were Postgres (SQL), MongoDB (noSQL) and Neo4j (NoSQL and Graph DB). The considerations for SQL vs noSQL were fairly standard (structure vs flexibility, efficiency vs scalability). The other option was considered specifically because of its applicability towards our project since our main functionaly is specifically graph-related. Another consideration was our collective familiarity with the various types of databases. Overall, we were the most familiar with MongoDB, with Postgres being a close second. Meanwhile, none of us had any experience with Neo4j, which meant that we would have to learn how to use it from scratch. In the end, we chose to use Neo4J because we determined that the functionality it could provide for us outweighed the potential learning curve. We made this decision by having David, who is in charge of the database and interacting with it, do some research on the pros and cons of the various database options. He then presented each option to the group and after some discussion, we voted on which option we preferred. Since David would be the one interacting with the database the most and deciding how to design it, his vote was weighted higher. Luckily, we all came to a consensus on using Neo4j since its functionality would make it alot easier to implement our planned features. 

Another issue that repeatedly came up was how we would gather data about the distances between rooms and create the virtual blueprint. Our first idea revolved around tracking the time or the steps it would take nurses to walk from room to room with an app, and then create a graph that represents that data to feed into the pathfinding system. We were drawn to this idea because it seemed much more flexible and dynamic than manually inputting the blueprints or building a computer vision system. However, some team members reread the project proposal and realized this system wouldn't work to the specifications the partner described because an additional app would have to be distributed to the nurses. We deliberated this choice for a while and then realized there was no way to come to a consensus without consulting the project partner. So, we arranged the first meeting with our partner soon after that, and presented the two options to him: whether we could proceed with a step-counting/distance based approach and give an app to the nurses, or if we should build a system to manually input blueprints that will directly connect to the existing scheduling system. He confirmed that we could not distribute apps to the nurses, which allowed to focus on one main implementation idea and move forward with that.

Finally, another decision we made was to change our partners proposal slightly. Our partner had proposed the interface for mapping out the hospital floor plans would consist of a grid based system in which the user would add blocks, representing walls, rooms, hallways, etc. We instead took a decision to change it to a system were we would draw lines connecting hallways where rooms would be represented using nodes. The pro of the grid based system was the simplicity, however the con was that it would have difificulty modeling oddly shaped hallways. The benefit of the line segment based system we proposed was its verstatility for mapping oddly shapped halways, but at the cost of a slighty more complicated interface. In the end the decision we took was the line segment based graph builder, the key reason being that during our meeting with our partner, he brought along an physical copy of a floor plan, and we noticed there were oddly shaped hallways and rooms which would not be accurately modeled with a grid based system. Since the partner was non-technical, he did not oppose the change and he accepted our technical expertise when it came to design and implementation of features.
