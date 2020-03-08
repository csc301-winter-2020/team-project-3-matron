# Team 3 - Matron

## Iteration 4 - Review & Retrospect

 * When: Thursday March 5, at 5:00pm
 * Where: Robarts Group Study Room 3

## Process - Reflection


#### Q1. Decisions that turned out well

List **process-related** (i.e. team organization and how you work) decisions that, in retrospect, turned out to be successful.


 * 2 - 4 decisions.
 * Ordered from most to least important.
 * Explain why (i.e. give a supporting argument) you consider a decision to be successful.
 * Feel free to refer/link to process artifact(s).

The first successful decision we made was adopting [GitHub projects](https://github.com/csc301-winter-2020/team-project-3-matron/projects/1) as a mixed kanban/scrum style project management board. The rich integration with other GitHub features such as issues, commits, branches, and pull requests, all of which we made heavy use of, helped it to organize the project extremely well. The projects feature naturally worked as a Kanban board with different columns, cards for each task that also double as issues, and automatic card movement when pull requests are merged or issues are created. It also has a feature called milestones which helped us to organize our work into scrum-style weekly sprints and completion tracking. Overall, GitHub helped to keep us organized and on track.

The second successful decision was splitting up the different areas of the project into different roles that each team member was in charge of. This allowed development to happen in parallel which sped up the iteration process and allowed each of us to focus more closely on a specific part of the project to give it more polish. Also, having team members dedicated to areas such as testing and DevOps helped to create a much more more polished product with quicker deployment, so that the rest of the team only needed to worry about their own tasks.

Finally, using Discord for internal communication was also a good decision because it facilitated internal communication and increased organization in the team. Having multiple channels allowed important annoucements to quickly reach the entire team such as team meetings or any changes. We also had separate channels for different areas of the project such as the front end or the backend, which helped multiple subteams collaborate in parallel without disturbing the others. Also, since a team of 8 members isn't actually very large overall, we had most of our discussion in a group channel which meant that most of the team was up to date on the state of the project at any given team. This let us work at quite a fast face near the end of the deliverable when we were squashing bugs that needed input from people on many different subteams, and overall let the project be developed faster.

#### Q2. Decisions that did not turn out as well as we hoped

List **process-related** (i.e. team organization and how you work) decisions that, in retrospect, were not as successful as you thought they would be.

 * 2 - 4 decisions.
 * Ordered from most to least important.
 * Explain why (i.e. give a supporting argument) you consider a decision to be unsuccessful
 * Feel free to refer/link to process artifact(s).
 
The first poor decision we made was to use Trello as our Kanban board instead of GitHub projects. Originally, this was because we were not aware that GitHub had it's own project management tool so for the first 2 weeks of the deliverable we were using a Trello page. The reason it worked poorly was because most of the team had never used Trello before, and it was a hassle to have to use an entirely separate service for the Kanban board. This meant that the team wasn't keeping it updated and checking in on it frequently, so the Trello page was frequently out of date and not very useful as a tool to track the overall team progress. When we eventually switched to GitHub projects, we found it worked much better with our workflow and organizational style.

Another poor planning decision was leaving project deployment to the end of the deliverable. The idea was that each person would develop their own features and we would integrate the components and deploy the project near the end once everyone had finished. In practice, this led to an inconsistent folder structure that resulted in many merge conflicts, as well as many bugs arising from the integration that now had to be fixed. In addition, some changes had to be made to the overall structure to get the project to work on Heroku which meant a late stage restructuring which took alot of time and introduced even more bugs. If we were to do the project again, we would start with a very basic Flask server and an established folder structure that we know would work with Heroku, and then split from there to each work on our own areas of the project.

#### Q3. Planned changes

List any **process-related** (i.e. team organization and how you work) changes you are planning to make (if there are any)

 * Ordered from most to least important.
 * Explain why you are making a change.
 
 One change we are planning to soon make relates to our project's documentation. As the codebase grows more complex and the API needs to be documented for future maintainability, we need to find a centralized place to write our documentation so that it's not just littered in various Discord messages and in our heads. Luckily, GitHub offers its free wiki page which works perfectly for our needs as it also integrates quite well with the other GitHub services we already use. In the coming weeks as we focus more on testing and polishing the product instead of adding new features, team members will be required to write documentation for the components they're in charge of to ensure all features and code is easy to understand.


## Product - Review

#### Q4. How was your product demo?
 * How did you prepare your demo?
 * What did you manage to demo to your partner?
 * Did your partner accept the features?
 * Were there change requests?
 * What did you learn from the demo from either a process or product perspective?
 * *This section will be marked very leniently so keep it brief and just make sure the points are addressed*

We prepared our demo by loading a sample hospital map we prepared in advance to showcase the various features of our product. We went over many key features such as uploading a blueprint, making a new map, deleting nodes and edges, saving and retreiving maps, and finding distance between rooms. Our partner was happy with our progress, and aside from some bugs we found which we plan to fix, there were no major changes requesting aside from mostly UI changes as we polish up our design. One thing we learned was to practice the demo in advance to ensure no large bugs are found that break the flow of the demo and to rehearse which key features to showcase to keep things running smoothly. We also learned that to a non-technical user, it's important to have a simple and intuitive UI and to test the UI frequently to ensure it's not to difficult to use.
