# Team 3 - Matron

> _Note:_ This document is intended to be relatively short. Be concise and precise. Assume the reader has no prior knowledge of your application and is non-technical.

## Description 
Our web-based app is to be used as a component in a Matron's larger overall system for managing the schedules of nurses and related healthcare professionals. The schedules of such workers are currently served by systems which don't take the physical layout of the work environment into account. As such, nurses regularly walk around their hospital wing much more than they need to (ie., by walking past patient rooms they're scheduled to visit later in the day) and become more exhausted and inefficient as a result. With Matron's spatially-optimized scheduling, nurses will recieve schedules that require them to walk the minimal amount.

Our application allows a hospital blueprint to be translated into a graph that allows room-to-room distances to be queried by the Matron scheduler. Users build this graph through a visual interface that allows them to add nodes representing rooms with a given label (eg., "exam room 3", "room 301", "supply room 6", etc.) and type (eg., "patient room", "supply room", "exam room", "workstation", etc.), and add edges between them representing hallways that connect the rooms.

Once the graph is built, it can be saved and then subsequently reloaded, edited, resaved, etc.

<!--
The application is primarily a web application, to be used as a component in Matron's larger overall system for managing medical care. The problem is that nurse tasks are currently scheduled by a system that does not take into account the spatial locations of rooms in the hospital. This leads to lots of extra workload and inefficiency which can increase nurse stress and negatively affect patient outcomes.
Our application will specifically handle the input and pathfinding of hospital unit maps, in order to compute the shortest paths between rooms. It's designed to integrate with the existing patient scheduler so that our API can be used to optimize pathfinding for nurses throughout the entire hospital. This will reduce stress in the hospital and help the Matron system to better schedule nurses to complete their tasks.
In order to optimize the pathfinding, the application maps all possible paths from one location to another to a certain magnitude. This magnitude could be a total number of steps took from the designated start and end locations, or a normalized sum of length of lines connecting the each nodes between the start and the end of a destination.-->

 * Provide a high-level description of your application and it's value from an end-user's perspective
 * What is the problem you're trying to solve?
 * Is there any context required to understand **why** the application solves this problem?

## Key Features
 * Users can upload an existing map of the unit to use as a guide when building the graph of the rooms.
 * Users can draw and modify the graph of the unit using nodes which are overlaid on the uploaded guide.
 * Users can measure the time it takes to get from any given room to anythere.
 * All created hospital maps are saved for users to retrieve and further edit.
 * Possible to obtain the relative distance from one location to another within map drawn or given by the users. 

 * Described the key features in the application that the user can access
 * Provide a breakdown or detail for each feature that is most appropriate for your application
 * This section will be used to assess the value of the features built

## Instructions

 * Clear instructions for how to use the application from the end-user's perspective
 * How do you access it? Are accounts pre-created or does a user register? Where do you start? etc. 
 * Provide clear steps for using each feature described above
 * This section is critical to testing your application and must be done carefully and thoughtfully
 
 As the end-user's perspective, the app can be accessed through any web browsers (although it has only been tested with the Chrome browser currently). Using the Chrome web browser, enter https://floating-shore-56001.herokuapp.com/ in the address bar the web access the application. The initial page of the application will have the "select unit" section in the middle and four different buttons on the top left corner. 
 
 The "select unit" section requests the user to choose or type in the specific unit he/she wishes to edit. The choice of the units can be shown by clicking the downward arrow. Once the user decides to edit the graph, it can be done by clicking the "Edit" button. This will allow the user to create nodes by clicking the "left mouse button" on the map chosen by the user. The edges between the nodes can also be created. This involves putting the mouse cursor on a node and "right mouse button" click and putting the mouse cursor on a different node "right mouse button" click again. The two nodes the user "right mouse button" clicked on will be the two ends of the node created. The above procedure can be repeated for the user to create rough blueprint of the map. The application will then edit the map accordingly.
 
 Of the four buttons in the top left corner of the page, the left most one directs the user to the home page of the application. The second left most button is the "save button". This allows the user to save the graph the user editted. the one next to it is the settings button. The right most button allows the user to see the distance between the two locations by inputting its name then clicking the "calculate" button on the right. 
 
 ## Development requirements
 The webapp is configured for heroku. The codebase can be directly deployed to heroku, or requirements can be manually installed. In either case, there is the additional requirement of a MongoDB server, which can be provisioned from heroku or elsewhere.
 * Install Python 3.6+
 * Install or Provision a MongoDB instance.
 * Clone the repo
 * Put your MongoDB access settings into `app/main.py` on line 13.
 * If using Heroku, push the current copy of the repo to the heroku-remote
 * If not using heroku, install python dependencies using `pip install -r requirements.txt`
 * To run the server: `python app/main.py`


 

 * If a developer were to set this up on their machine or a remote server, what are the technical requirements (e.g. OS, libraries, etc.)?
 * Briefly describe instructions for setting up and running the application (think a true README).
 
 ## Deployment and Github Workflow

Describe your Git / GitHub workflow. Essentially, we want to understand how your team members shares a codebase, avoid conflicts and deploys the application.
 * Be concise, yet precise. For example, "we use pull-requests" is not a precise statement since it leaves too many open questions - Pull-requests from where to where? Who reviews the pull-requests? Who is responsible for merging them? etc.
 * If applicable, specify any naming conventions or standards you decide to adopt.
 * Describe your overall deployment process from writing code to viewing a live applicatioon
 * What deployment tool(s) are you using and how
 * Don't forget to **briefly explain why** you chose this workflow or particular aspects of it!
 
Our main process from writing code to a live application is:

 * The two core branches are master and develop. Both core branches are protected, as merging to master requires three code reviews and merging to develop requires one. This is because develop is for fast iterations and new features, but master should reflect a more thorough and polished version of the project.
 * When a feature is planned, an issue is created for it and a card is generated for the project view.
 * Once someone begins working on the feature, they create a branch for the feature, and move the card to "In Progress". All code changes relevant to this feature should only be made in this branch.
 * Once the feature is complete, a pull request from their branch to develop is opened. Any team member is able to test and review the code.
 * Once tested and reviewed, it can be merged into develop, from where it is automatically deployed to Heroku to test the new feature
 * When it is time to make a release, develop is merged into master, undergoing significant testing and review in the process. Master also has automatic deployments to Heroku, to use as demos to show the partner
 
 Some additional information:
 
 * We chose to assign tasks by features of the app because we each have expertise in different areas. Using branching in the git repository was the optimal way to accomodate people working on different parts of the app. 
 * The testing before pull request is done to ensure the new feature will work well with the other parts of the app and is bug free. If the test fails, the person assigned to that feature can go back to the branch and fix the issue and then it can be tested again
 * We are working on integrating a continuous integration service to automatically run tests, like Travis CI or GitHub actions. Once this is complete, we'll require tests to pass before being able to merge to develop or master.

 ## Licenses 

 Keep this section as brief as possible. You may read this [Github article](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/licensing-a-repository) for a start.

 * What type of license will you apply to your codebase?
 * What affect does it have on the development and use of your codebase?
 * Why did you or your partner make this choice?
 
 We decided to use the MIT license because we felt it is the one of the best open source licenses available. Firstly, It does not require any derivative works to also use that license unlike GPL. Since we are building an addon for an existing service that may one day need to extend our code, this aspect is appealing to both us and the project partner. It also means other projects that want to build on our code can use it freely without having any licensing restrictions or paying any fees
 
 


