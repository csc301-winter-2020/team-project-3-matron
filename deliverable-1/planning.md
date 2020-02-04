# YOUR PRODUCT/TEAM NAME
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

Our project is to build a plug-in to an already existing product to help calculate the distance between any two given rooms in a hospital wing.

The problem presented to us is that nurses in hospital have a perceived increased workload based off how much they are required for their job. This in turn may increase stress which may lower the quality of work effecting the patients, so our job is to help minimize the amount of traveling a nurse is required to do on a given work day to aid in preventing this work exhaust from happening.

This will be a plug-in to an already existing web based software that the hospital administrator/interns are currently using. Since the hospital administrator is responsible for handling the nurses schedules, the most common use case would be to calculate the distances between any two room in the nurses' schedules.
In terms of interns, in case distances are not yet collected for a given sect in the hospital, it is their job to find and said distance and input it into the system.


#### Q2: Who are your target users?

  > Short (1 - 2 min' read max)
 * Be specific (e.g. a 'a third-year university student studying Computer Science' and not 'a student')
 * **Feel free (but not obligated) to use personas.         
   You can create your personas as part of this Markdown file, or add a link to an external site (for example, [Xtensio](https://xtensio.com/user-persona/)).**

#### Q3: Why would your users choose your product? What are they using today to solve their problem/need?

> Short (1 - 2 min' read max)
 * We want you to "connect the dots" for us - Why does your product (as described in your answer to Q1) fits the needs of your users (as described in your answer to Q2)?
 * Explain the benefits of your product explicitly & clearly. For example:
    * Save users time (how much?)
    * Allow users to discover new information (which information? And, why couldn't they discover it before?)
    * Provide users with more accurate and/or informative data (what kind of data? Why is it useful to them?)
    * Does this application exist in another form? If so, how does your differ and provide value to the users?
    * How does this align with your partner's organization's values/mission/mandate?

#### Q4: How will you build it?

> Short (1-2 min' read max)
 * What is the technology stack? Specify any and all languages, frameworks, libraries, PaaS products or tools. 
 * How will you deploy the application?
 * Describe the architecture - what are the high level components or patterns you will use? Diagrams are useful here. 
 * Will you be using third party applications or APIs? If so, what are they?
 * What is your testing strategy?

#### Q5: What are the user stories that make up the MVP?

 * At least 5 user stories concerning the main features of the application - note that this can broken down further
 * You must follow proper user story format (as taught in lecture) ```As a <user of the app>, I want to <do something in the app> in order to <accomplish some goal>```
 * If you have a partner, these must be reviewed and accepted by them
 * The user stories should be written in Github and each one must have clear acceptance criteria.
 
 Tentative User Stories:
 
  - As a manager, I want to be able to input two rooms in my unit and obtain the distance between them
  - As a manager, I want to be able to get a list of the nearest supplyrooms and workstations to optimize nurse schedules
  - As an intern, I want to be able to upload a hospital blueprint to create and use a digital map of rooms and hallways 
  - As an intern, I want to be able to edit rooms on the digital map to reflect changes in where patients are
  - An an intern, I want to be able to estimate the distance between rooms on a map through logging my accelerometer data


----

## Process Details

#### Q6: What are the roles & responsibilities on the team?

Describe the different roles on the team and the responsibilities associated with each role. 
 * Roles should reflect the structure of your team and be appropriate for your project. Not necessarily one role to one team member.

List each team member and:
 * A description of their role(s) and responsibilities including the components they'll work on and non-software related work
 * 3 technical strengths and weaknesses each (e.g. languages, frameworks, libraries, development methodologies, etc.)
 
Adit:
  role:
  
  strengths:
  - Front end development HTML, CSS, JS, and graphic design
  - Good experience with databases SQL and noSQL
  - Experience with web development with MERN stack, django, and flask
  
  weaknesses:
  - GIT merging conflicts
  - Infrequent activity of group project discord, as well low profiency with discord
  - No experience with development methodologies
  
Thomas:
	role: back-end routing
		- Handling routing of the information coming from the back-end 
		
	strengths:
	- Experience with python, HTML, CSS, and JS.
	- Capable of handling flexible workloads and working on other parts of the project if required.
	- Thoroughly experienced with debugging personal and other individuals code.
	
	weaknesses:
	- Working with the foreign libraries and frameworks that will be used.
	- Handling GIT conflicts such as merging.
	- Can't show up to tourney match
  
David:
  role:

  strengths:
  - database management (PostgreSQL and MongoDB)
  - server implementation in node.js, flask
  - python, javascript
  
  weaknesses:
  - general front end design (HTML/CSS) and associated UI libraries (bootstrap, react, etc.)
  - mobile development/programming (both android/iOS)
  - testing and debugging
  
  John:
  role: Tester and unittest assistant
   * Writing unittests and making sure the unittests works for people who have already written it
   * Debugging if unittest does not work
  
  strengths:
  - Able write in python, SQL, javascript, html/css.
  - Likes to test and debug code - (good ability to pay attention to details).
  - Experience in mobile android app development.
  
  weaknesses:
  - Overall little technical experience in web development.
  - Not much familiar with design patterns.
  - Not familiar with libraries used in front-end. 


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

The main purpose of the meetings will be to update the team on our progress so far, and share any questions or concerns that any team members have about the project. We plan to use a less strict organizational methodology like Kanban, so weekly meetings to check in and ensure we're on track will be necessary to keep us organized

We also have our meetings with our project partner. These will be biweekly and online via Skype, as per our partner's preference. Depending on our availabilites different amounts of the team may join, but we have a dedicated partner liason who will be the one to schedule the meetings and speak to the partner. If nobody else can join, the partner liason will be responsible for taking the group's concerns to the partner and bringing back information at the weekly team meetings.
  
#### Q8: What artifacts will you use to self-organize?

List/describe the artifacts you will produce in order to organize your team.       

 * Artifacts can be To-Do lists, Task boards, schedule(s), meeting minutes, etc.
 * We want to understand:
   * How do you keep track of what needs to get done?
   * How do you prioritize tasks?
   * How do tasks get assigned to team members?
   * How do you determine the status of work from inception to completion?
   
Our team's primary means of internal communication is via Discord. Our group's server has 5 total text channels split into two categories:

Organizational: Three text channels under this category are used to make team-wide announcements, post meeting minutes, and share important notes as they come up.
Production: Two text channels here are used for general chat and issue discussion when it requires the attention of some or all other team members. This server provides a quick means of instant messaging between the group while still organizing messages into unique and useful categories. There are also 4 voice chat rooms which our team members may join at any time. We have multiple voice chat rooms so that members may split off into pairs or small groups and work on issues/files together.
Our team also has a Trello board where we use a form of Kanban. We post important information (To-do lists, pending tasks, links to Google documents, etc.) here as well. Group members can see when one member takes on a specific task, as well as when it is completed.

#### Q9: What are the rules regarding how your team works?

Describe your team's working culture.

**Communications:**
 * What is the expected frequency? What methods/channels are appropriate? 
 * If you have a partner project, what is your process (in detail) for communicating with your partner?
 
Between group members, minimum of once a week because we have a weekly meetings. On average, we expect to speak with each other regarding the project about once every other day via our Discord channel or in person. For emergencies, we've all shared our phone numbers with each other except for 1 group member who didn't consent. Our expected frequency of communications with the partner is biweekly, as per the partners preference, with a Skype call or via email for immediate requests. We have a dedicated partner liason who will be responsible for keeping the partner up to date on our progress and sending emails if we have any questions.

**Meetings:**
 * How are people held accountable for attending meetings, completing action items? Is there a moderator or process?
 
If a group member doesn't attend a meeting or complete an assigned action item, the team lead will contact them and ask for justification about why they didn't attend. Since all the group members are friends in real life, we don't expect this to happen often and if it does we can just ask them in person.
 
**Conflict Resolution:**
 * List at least three team scenarios/conflicts you discussed in lecture and how you decided you will resolve them. Indecisions? Non-responsive team members? Any other scenarios you can think of?




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
