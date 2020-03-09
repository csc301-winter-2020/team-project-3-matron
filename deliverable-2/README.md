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

## Key Features (Implemented)
 1. Users can load saved maps/blueprint images via the map name.
 2. Users can create a new named map with an optional blueprint backdrop image.
 3. Users can delete saved maps/blueprint images via the map name.
 4. Users can edit the map via the mouse/keyboard (add/remove/rename/retypeset nodes, add/remove edges).
 5. Users can save the current loaded map.
 6. Users can obtain the relative distance from one room to another within the current graph.
 
 7. Responsive button colors/messages let the user know when they're missing required inputs.
 8. Node/edge snapping.
 
 <!--* Users can load/view an existing map and blueprint image from its name.

 * Users can upload an existing map of the unit to use as a guide when building the graph of the rooms.
 * Users can draw and modify the graph of the unit using nodes which are overlaid on the uploaded guide.
 * Users can measure the time it takes to get from any given room to anythere.
 * All created hospital maps are saved for users to retrieve and further edit.
 * Possible to obtain the relative distance from one location to another within map drawn or given by the users. 

 * Described the key features in the application that the user can access
 * Provide a breakdown or detail for each feature that is most appropriate for your application
 * This section will be used to assess the value of the features built -->

## Instructions

 * Clear instructions for how to use the application from the end-user's perspective
 * How do you access it? Are accounts pre-created or does a user register? Where do you start? etc. 
 * Provide clear steps for using each feature described above
 * This section is critical to testing your application and must be done carefully and thoughtfully
 
 The develop branch auto deploys to https://floating-shore-56001.herokuapp.com/.
 
 Designed for the <strong>latest version of Chrome on Windows</strong>. No guarantees on other platforms.  
 
 Optimized for use with a <strong>3-button mouse</strong>. Results may vary with other input devices.
 
 1. I want to load an existing map:
    On the homepage I'm prompted to select a unit to load via a searchable dropdown. I can leftclick the search box and select it from the dropdown, or begin typing its name to narrow the search results before leftclicking on it. I then click the green "edit map" button to load it.
    
    (Note, the map entitled "demo" will always exist for loading/editing as it is intentionally undeletable for demo purposes.)
 
 2. I want to create a new graph:
    On the homepage I'm prompted to select a unit to load via a searchable dropdown. I leftclick the search box and begin typing a new name. Eventually I'll be shown the option to "add <new name>". I leftclick this option and am prompted with the option to upload a blueprint image to serve as the backdrop for my map. Note that uploading a blueprint is NOT required (you can tell since the "Create floor button" is green, indicating that we may proceed). I then click the "Create floor button" and am taken to a new blank canvas potentially filled with a backdrop image if one was uploaded.
 
 3. I want to delete an existing map:
    On the homepage I'm prompted to select a unit to load via a searchable dropdown. I leftclick the search box and see a list of existing maps. If I click the red "x" to the right of each map name, I will delete that map from the database. (Note that the map entitled "demo" is undeletable for demo purposes.)
 
 4. I want to edit the current loaded map in the graph editor:
    I leftclick the canvas to add a new room (large) node. I am then prompted to enter the node's label (eg. "room 301") and type (eg. "classroom"). The type dropdown works the same as the map selection dropdown on the homepage, ie., I can select an existing node type or enter a new one via the keyboard. Note that no types existing on a newly created map. Once a type is created, it will show up as option in the type dropdown for subsequent nodes. Once the inputs are valid, the red "Enter label" button will transition to a green "Save node" button which I click to save the node.
    
    I leftclick an existing room (large) node to edit its label or type.
    
    I rightclick the canvas to add a hallway (small) node. This enables a "ghost edge" that follows my cursor. In this state, if I click the canvas, I create a new hallway node and move the "ghost edge" source to the new node. This enables me to easily create long stretches of curvy hallways. If I rightclick on an existing node, I create an edge between the ghost source and the rightclicked node. If I press Esc, I remove the ghost edge. If I rightclick on an existing edge, a new hallway node will be formed at the junction between that edge and the ghost edge. (Note that while the ghost edge is enabled, the snapping distance is increase substantially to make it easier to connect things. A cyan border is added to the nearby element my rightclick will snap to. If the snapping distance is too great and I require more precision, I can simply zoom in via the scroll-wheel.)
    
    I rightclick an existing node to enable a "ghost edge" with its source set to the rightclicked node.
    
    I leftclickHold and drag on an existing node to move it and its connected edges.
    
    I hold ctrl+leftclickHold and drag over the canvas to box select/deselect. (Actually toggles the selection of all nodes in the box.)
    
    I leftclickHold and drag on the canvas to pan the camera.
    
    I scroll to zoom the camera in and out.
    
    I press X to delete nodes/edges selected via box select.
    
    I press Esc to disable the ghost edge if it's enabled.
    
 5. I want to save my current map:
    In the graph editor interface, I leftclick the save button in the top left corner to save my graph to the database. (Note that empty graphs will not be saved.) It will be saved under the name chosen back at the homepage. Later I can load this version of the graph from the homepage via that name.
    
 6. I want to obtain the distance between two rooms in the current map:
    In the graph editor interface, I leftclick the paper plane button (to the right of the save button). This opens a popup that prompts me to enter the labels of two rooms in my graph. When I leftclick the calculate button it displays the distance or gives me an error message prompting me to retry with the correct arguments.
    
    Distance query notes:
       * If I've modified the map, I need to save before the distances will update.
       * The number is unitless, as these distances are only ever compared relative to each other.
       * If the returned value is -1, this indicates that no path exists between the two given rooms.
       * This element queries our backend API to obtain the distance. Normally, such API methods will only be called by the backend Matron scheduling API. This element exists solely for debugging and demonstration purposes.
    
    
 
 <!--As the end-user's perspective, the app can be accessed through any web browsers (although it has only been tested with the Chrome browser currently). Using the Chrome web browser, enter https://floating-shore-56001.herokuapp.com/ in the address bar the web access the application. The initial page of the application will have the "select unit" section in the middle and four different buttons on the top left corner. 
 
 The "select unit" section requests the user to choose or type in the specific unit he/she wishes to edit. The choice of the units can be shown by clicking the downward arrow. Once the user decides to edit the graph, it can be done by clicking the "Edit" button. This will allow the user to create nodes by clicking the "left mouse button" on the map chosen by the user. The edges between the nodes can also be created. This involves putting the mouse cursor on a node and "right mouse button" click and putting the mouse cursor on a different node "right mouse button" click again. The two nodes the user "right mouse button" clicked on will be the two ends of the node created. The above procedure can be repeated for the user to create rough blueprint of the map. The application will then edit the map accordingly.
 
 Of the four buttons in the top left corner of the page, the left most one directs the user to the home page of the application. The second left most button is the "save button". This allows the user to save the graph the user editted. the one next to it is the settings button. The right most button allows the user to see the distance between the two locations by inputting its name then clicking the "calculate" button on the right. -->
 
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

 * The two core branches are master and develop. Both core branches are protected, as merging to master requires three code reviews, and merging to develop requires one.
 * When a feature is planned, an issue is created for it, and a card is generated for the project view.
 * Once someone begins working on the feature, they create a branch for the feature, and move the card to "In progress" All code changes relevant to this feature should only be made in this branch.
 * Once the feature is complete, a pull request to develop is opened.
 * Once tested and reviewed, it can be merged into develop.
 * When it is time to make a release, develop is merged into master, undergoing significant testing and review in the process.
 * We chose to assign each individual by each features of the app because our teamates were expertized in different set of skills. Furthermore, the branching in the git repository was the optimum way to accomodate people working on different parts of the app. Because it was optimum for only assigned individual or individuals to work on a specific feature, we had to divide the overall task by branching.
 * The testing before pull request is done to see if the worked on feature can synchronize well with the other parts of the app. If the test fails, the person assigned to that feature (who must be the most knowledgeable about it) can go back to the branch and fix the issue.

 * Be concise, yet precise. For example, "we use pull-requests" is not a precise statement since it leaves too many open questions - Pull-requests from where to where? Who reviews the pull-requests? Who is responsible for merging them? etc.
 * If applicable, specify any naming conventions or standards you decide to adopt.
 * Describe your overall deployment process from writing code to viewing a live applicatioon
 * What deployment tool(s) are you using and how
 * Don't forget to **briefly explain why** you chose this workflow or particular aspects of it!

 ## Licenses 

 Keep this section as brief as possible. You may read this [Github article](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/licensing-a-repository) for a start.

 * What type of license will you apply to your codebase?
 * What affect does it have on the development and use of your codebase?
 * Why did you or your partner make this choice?


