# Team 3 - Matron

> _Note:_ This document is intended to be relatively short. Be concise and precise. Assume the reader has no prior knowledge of your application and is non-technical.

## Description 
The application is primarily a web application, to be used as a component in Matron's larger overall system for managing medical care.
 Our application will specifically handle the input and processing of hospital unit maps, in order to compute the shortest paths between rooms.
 The goal of this application is to reduce the time spent walking by hospital staff, which has been shown to increase stress and burnout, which can also negatively affect patients.
An additional component of our application will be a webapp for smartphones that can be used by hospital staff to actually measure time between rooms, in order to tune the graph that represents the unit.

 * Provide a high-level description of your application and it's value from an end-user's perspective
 * What is the problem you're trying to solve?
 * Is there any context required to understand **why** the application solves this problem?

## Key Features
 * Users can upload an existing map of the unit to use as a guide when building the graph of the rooms.
 * Users can draw and modify the graph of the unit using nodes which are overlaid on the uploaded guide.
 * Users can tweak the time it takes to get from one room to another by measuring with the smartphone webapp.
 * Users, via Matron's tools, will be able to view paths generated for them.

 * Described the key features in the application that the user can access
 * Provide a breakdown or detail for each feature that is most appropriate for your application
 * This section will be used to assess the value of the features built

## Instructions
 


 * Clear instructions for how to use the application from the end-user's perspective
 * How do you access it? Are accounts pre-created or does a user register? Where do you start? etc. 
 * Provide clear steps for using each feature described above
 * This section is critical to testing your application and must be done carefully and thoughtfully
 
 ## Development requirements
 The webapp is configured for heroku. The codebase can be directly deployed to heroku, or requirements can be manually installed. In either case, there is the additional requirement of a MongoDB server, which can be provisioned from heroku or elsewhere.
 * Install python 3.8+
 * Install or Provision a MongoDB instance.
 * Clone the repo
 * Get your MongoDB uri and paste it into `app/main.py` on line 13.
 * If using heroku, just `heroku local`, or associate the repo with your heroku app.
 * If not using heroku, install python dependencies globally (kinda bad, `pip install -r requirements.txt`) or locally, with your choice of virtual environment such as Pipenv.
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

