# sya-app

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

sendgrid login info:
username: ddavisscott@gmail.com
pw: Xododx999!
sendgrid api key: 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
sendgrid email templete id: 98d40d35-a3a9-4bea-a540-7085561d8de2

working on your branch:

There are 3 branches for sprint1 
# Chat
#paypal
#email_trigger

Workflow:

1. cd in your project folder run:
git branch

2. you should see all the branches avaliable. Then run

git checkout <branch_name>

3. run 
git branch
 to confirm that you are on the branch that you want to be on

 4. start working on the project. each time you have an iteration forward run
git status // to see your changes
 git add .
 git commit -m"a description of the new features"
 you are readdy for a pull request

5 .but first go back to master(  or the branck that you are merging into) and check if there is any changes on the master

git checkout master
git pull 

6 . check the master branch for changes
    if there are any changes:
    a. go back to your branch
    git checkout <branch_name>
    git merge master

    theremay be some conflicts. If there is a conflict,go back to the file that you have a conflict.
    There you should see the coflict marked.
    Modify the code and resolve the conflict.
    when the conflict is resolved run 
    git status
    git add -A
    git commit (escape :wq to escape vim)
    git push set upstream origin <branch_name>
7. You have succesfully pushed to your branch

8. on Githup UI, click on compare&pull request
    check your upate
9. Click on pull request. Write a meaningful, detailed comment.
10. Check your pull requrst an d make sure it happened.
11. Get a team member to review your request.
12. If the branch is readr to merge, hit merge button
13. Check master and confirm the merge




