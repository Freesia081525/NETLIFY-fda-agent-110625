You've hit a very common and thankfully simple-to-fix deployment error!
This error message:
Error: Cannot find module '/opt/render/project/src/server.js'
...is telling us exactly what's wrong. Render is trying to run your start command (node server.js), but it's looking for the server.js file in the main root folder of your project (/opt/render/project/src/) and can't find it there.
The reason is that your server.js file is inside the server sub-directory.
The Solution: Set the Root Directory on Render
The most likely cause is that the Root Directory setting for your service on Render was not set. You need to tell Render to "change into" the server directory before it tries to run any commands.
Here is how to fix it, step-by-step:
Go to your Render Dashboard: Log in to dashboard.render.com.
Select your Backend Service: Click on the name of the web service you created for your backend (e.g., agentic-processor-api).
Navigate to Settings: In the left-hand menu, click on the "Settings" tab.
Find the "Build & Deploy" Section: Scroll down until you see the settings for building your app.
Set the Root Directory: Find the input field labeled Root Directory. It is probably blank right now. You must enter server into this field.
Save Changes: Scroll to the bottom of the page and click the "Save Changes" button.
Trigger a New Deploy: After saving, Render might start a new deployment automatically. If not, go to the "Events" or "Manual Deploy" tab and click "Deploy latest commit" to force Render to try again with the new setting.
Summary of Correct Render Settings
To be perfectly clear, your settings for the backend service on Render should be:
Root Directory: server
Build Command: npm install
Start Command: node server.js
Troubleshooting Checklist
If for some reason the above fix doesn't work, please quickly double-check these things:
Is the server Folder Pushed to GitHub? Go to your GitHub repository online and make sure you can see the server folder and that it contains server.js and package.json. It's possible the files were created locally but never committed and pushed.
Is the Filename Correct? Make sure the file is named exactly server.js (all lowercase). Linux servers, which Render uses, are case-sensitive.
Is Your Project Structure Correct? Your repository's structure should look like this:
code
Code
your-project-folder/
├── node_modules/
├── public/
├── src/
│   ├── App.jsx      <-- Your React frontend
│   └── ...
├── server/          <-- The folder for your backend
│   ├── server.js    <-- Your Node.js server code
│   └── package.json <-- Your backend dependencies
├── .gitignore
├── package.json     <-- Your frontend package.json
└── README.md
Once you correct the Root Directory setting, your backend will find the server.js file and should deploy successfully.
