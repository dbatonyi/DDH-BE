<h1>Drupal Development Helper (DDH) DEV</h1>
<h3>App tech stack and functions</h3>

<h4>Tech stack:</h4> 
<ul>
<li>Node.js</li>
<li>Sequelize</li>			
</ul>

<h4>Application functions:</h4>

Login/Register users
Let editors make and edit the knowledge base
Make a knowledge base with search function
Create projects with specific parameters
View projects list by its name
Edit/Delete projects
Create task for the developer, what to pay attention before release ( via meistertask if possible )

<h2>App development roadmap</h2>

<h3>Step 1</h3>

<p>Create and populate the database with the needed tables ( via Sequelize ).</p>

<ul>
<li>‘users’
<ul>
<li>‘uuid’ : unique user id,</li>
<li>‘username’ : user name,</li>
<li>‘email’ : user email</li>
</ul>
</li>
</ul>

<ul>
<li>‘tasks’
<ul>
<li>‘uuid’ : unique task id,</li>
<li>‘title’ : taske title,</li>
<li>‘taskCategory’ : contain the task category,</li>
<li>‘taskDescription’ : this will show up in the task,</li>
<li>‘userId’ : which user make this</li>
</ul>
</li>
</ul>

<ul>
<li>‘knowledge’
<ul>
<li>‘uuid’ : unique knowledge id,</li>
<li>‘knowledgeId’ : connect task via id,</li>
<li>‘title’ : knowledge title,</li>
<li>‘body’ : knowledge body</li>
</ul>
</li>
</ul>
Example Seq. code:
´sequelize model:generate –name Role –attributes roleName:string´

<h3>Roles should be the followings:<h3>
<p>
<ul>
<li>Admin</li>
<li>Editor</li>
<li>User</li>
</ul>
</p>

<h3>API endpoint list:</h3>

Registration endpoint
