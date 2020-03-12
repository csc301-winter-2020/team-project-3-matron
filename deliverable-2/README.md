# Team 3 - Matron

## Description 
Our web-based app is to be used as a component in a Matron's larger overall system for managing the schedules of nurses and related healthcare professionals. The schedules of such workers are currently served by systems which don't take the physical layout of the work environment into account. As such, nurses regularly walk around their hospital wing much more than they need to (ie., by walking past patient rooms they're scheduled to visit later in the day) and become more exhausted and inefficient as a result. With Matron's spatially-optimized scheduling, nurses will receive schedules that require them to walk the minimal amount.

Our application allows a hospital blueprint to be translated into a graph that allows room-to-room distances to be queried by the Matron scheduler. Users build this graph through a visual interface that allows them to add nodes representing rooms with a given label (eg., "exam room 3", "room 301", "supply room 6", etc.) and type (eg., "patient room", "supply room", "exam room", "workstation", etc.), and add edges between them representing hallways that connect the rooms.

Once the graph is built, it can be saved and then subsequently reloaded, edited, resaved, etc.

## Key Features (Implemented)
 1. Users can load saved maps/blueprint images via the map name.
 2. Users can create a new named map with an optional blueprint backdrop image.
 3. Users can delete saved maps/blueprint images via the map name.
 4. Users can edit the map via the mouse/keyboard (add/remove/rename/retypeset nodes, add/remove edges).
 5. Users can save the current loaded map.
 6. Users can obtain the relative distance from one room to another within the current graph.
 
 7. Responsive button colors/messages let the user know when they're missing required inputs.
 8. Node/edge snapping and edge junction creation.
 
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
 The master branch auto deploys to https://salty-shelf-59230.herokuapp.com/.

 The develop branch auto deploys to https://floating-shore-56001.herokuapp.com/.
 
 Designed for the <strong>latest version of Chrome on Windows</strong>. No guarantees on other platforms.  
 
 Optimized for use with a <strong>3-button mouse</strong>. Results may vary with other input devices.
 
 We have no user accounts.
 
 1. I want to load an existing map:
 
    On the homepage I'm prompted to select a unit to load via a searchable dropdown. I can leftclick the search box and select it from the dropdown, or begin typing its name to narrow the search results before leftclicking on it. I then click the green "edit map" button to load it.
    
    (Note, the map entitled "demo" will always exist for loading/editing as it is intentionally undeletable for demo purposes.)
 
 2. I want to create a new graph:
 
    On the homepage I'm prompted to select a unit to load via a searchable dropdown. I leftclick the search box and begin typing a new name. Eventually I'll be shown the option to "add <new name>". I leftclick this option and am prompted with the option to upload a blueprint image to serve as the backdrop for my map. Note that uploading a blueprint is NOT required (you can tell since the "Create floor button" is green, indicating that we may proceed (key feature 7)). I then click the "Create floor button" and am taken to a new blank canvas potentially filled with a backdrop image if one was uploaded.
 
 3. I want to delete an existing map:
 
    On the homepage I'm prompted to select a unit to load via a searchable dropdown. I leftclick the search box and see a list of existing maps. If I click the red "x" to the right of each map name, I will delete that map from the database. (Note that the map entitled "demo" is undeletable for demo purposes.)
 
 4. I want to edit the current loaded map in the graph editor:
 
    I leftclick the canvas to add a new room (large) node. I am then prompted to enter the node's label (eg. "room 301") and type (eg. "classroom"). The type dropdown works the same as the map selection dropdown on the homepage, ie., I can select an existing node type or enter a new one via the keyboard. Note that no types existing on a newly created map. Once a type is created, it will show up as option in the type dropdown for subsequent nodes. Once the inputs are valid, the red "Enter label" button will transition to a green "Save node" button which I click to save the node.
    
    I leftclick an existing room (large) node to edit its label or type.
    
    I rightclick the canvas to add a hallway (small) node. This enables a "ghost edge" that follows my cursor. In this state, if I click the canvas, I create a new hallway node and move the "ghost edge" source to the new node. This enables me to easily create long stretches of curvy hallways. If I rightclick on an existing node, I create an edge between the ghost source and the rightclicked node. If I press Esc, I remove the ghost edge. If I rightclick on an existing edge, a new hallway node will be formed at the junction between that edge and the ghost edge (key feature 8). (Note that while the ghost edge is enabled, the snapping distance is increase substantially to make it easier to connect things. A cyan border is added to the nearby element my rightclick will snap to. If the snapping distance is too great and I require more precision, I can simply zoom in via the scroll-wheel.)
    
    I rightclick an existing node to enable a "ghost edge" with its source set to the rightclicked node.
    
    I leftclickHold and drag on an existing node to move it and its connected edges.
    
    I hold ctrl+leftclickHold and drag over the canvas to box select/deselect. (Actually toggles the selection of all nodes in the box.)
    
    I leftclickHold and drag on the canvas to pan the camera.
    
    I scroll to zoom the camera in and out.
    
    I press X on my keyboard to delete nodes/edges selected via box select.
    
    I press Esc to disable the ghost edge if it's enabled.
    
 5. I want to save my current map:
 
    In the graph editor interface, I leftclick the save button in the top left corner to save my graph to the database. (Note that empty graphs will not be saved.) It will be saved under the name chosen back at the homepage. Later I can load this version of the graph from the homepage via that name.
    
 6. I want to obtain the distance between two rooms in the current map:
 
    In the graph editor interface, I leftclick the paper plane button (to the right of the save button). This opens a popup that prompts me to enter the labels of two rooms in my graph. When I leftclick the calculate button it displays the distance or gives me an error message prompting me to retry with the correct arguments.
    
    Distance query notes:
       * <strong>If I've modified the map, I need to save before the distances will update.</strong>
       * The number is unitless, as these distances are only ever compared relative to each other.
       * If the returned value is -1, this indicates that no path exists between the two given rooms.
       * This element queries our backend API to obtain the distance. Normally, such API methods will only be called by the backend Matron scheduling API. This element exists solely for debugging and demonstration purposes.
 
 ## Development requirements
 The webapp is configured for heroku. The codebase can be directly deployed to heroku, or requirements can be manually installed. In either case, there is the additional requirement of a MongoDB server, which can be provisioned from heroku or elsewhere.
 * Install Python 3.6+
 * Install or Provision a MongoDB instance.
 * Clone the repo
 * Put your MongoDB access settings into `app/main.py` on line 13.
 * If using Heroku, push the current copy of the repo to the heroku-remote
 * If not using heroku, install python dependencies using `pip install -r requirements.txt`
 * To run the server: `python app/main.py`

 
 ## Deployment and Github Workflow
 
Our main process from writing code to a live application is:

 * The two core branches are master and develop. Both core branches are protected, as merging to master requires three code reviews and merging to develop requires one. This is because develop is for fast iterations and new features, but master should reflect a more thorough and polished version of the project.
 * When a feature is planned, an issue is created for it and a card is generated for the project view.
 * Once someone begins working on the feature, they create a branch for the feature, and move the card to "In Progress". All code changes relevant to this feature should only be made in this branch.
 * Once the feature is complete, a pull request from their branch to develop is opened. Any team member is able to test and review the code.
 * Once tested and reviewed, it can be merged into develop, from where it is automatically deployed to Heroku to test the new feature
 * When it is time to make a release, develop is merged into master, undergoing significant testing and review in the process. Master also has automatic deployments to Heroku, to use as demos to show the partner
 
 Some additional information:
 
 * We chose to assign tasks by features of the app because we each have expertise in different areas. Using branching in the git repository was the optimal way to accommodate people working on different parts of the app. 
 * The testing before pull request is done to ensure the new feature will work well with the other parts of the app and is bug free. If the test fails, the person assigned to that feature can go back to the branch and fix the issue and then it can be tested again
 * We are working on integrating a continuous integration service to automatically run tests, like Travis CI or GitHub actions. Once this is complete, we'll require tests to pass before being able to merge to develop or master.

 ## Licenses 
 
 We decided to use the MIT license because we felt it is the one of the best open source licenses available. Firstly, It does not require any derivative works to also use that license unlike GPL. Since we are building an addon for an existing service that may one day need to extend our code, this aspect is appealing to both us and the project partner. It also means other projects that want to build on our code can use it freely without having any licensing restrictions or paying any fees
 
 


