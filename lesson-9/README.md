Now that we have `hello` tracked, let's get ready to share it by

# Signing up for [github.com](https://github.com)

1. Sign up on the form on the right: [github.com](https://github.com)

1. If it asks about a plan, pick the free one.

1. You're all signed up!

Github hosts our repositories -- it makes it so that we can reach our code online.  We can put our git repo there by first making a place for the repository.

# Make a repository online

1. Click on the plus sign by your username.

1. Click on `New Repository` from the drop-down.

1. Let's name our repository `hello`, just like our directory name.  Matching the name of the repo online with our repo locally helps us stay organized.

1. Click 'Create Repository'.

# Connect the `hello` repository on our computer to it's new online home.

1. Once you've created `hello` online, github will give you commands you can use to link the `hello` on your computer to the one we just created online.  It looks something like this:

  ```bash
  git remote add origin https://github.com/pandafulmanda/hello.git
  git push -u origin master
  ```

  You can click on the clipboard button on the right to copy the code to your clipboard.

1. Press <kbd>Enter</kbd> to run the code.  Now, if we refresh the page for the `hello` repo online, we'll see our code!

  So what did we do in that last step?

  1. `git remote add origin blahblahblah/hello.git` tells our git repo that it has a remote home by the name of origin at blahblahblah/hello.git

  1. `git push -u origin master` tells our git to push up to that remote home the master version of our code!

  ![](http://mrwgifs.com/wp-content/uploads/2013/07/Minion-Amazed-Expression-In-Despicable-Me-2.gif)


Let's try this again with our site project!

# Making our site project a git repository

One way to share our site's code and see it online is to make it a git repository and put it on Github.  Let's start with making our site into a git repo (short for repository).

Like we did with our `hello` directory,

1. **c**hange **d**irectory into the project directory.

1. Tell **git** to **init**ialize in the directory.

1. Tell **git** to **add** all the files in the directory to the stage.

  You can tell it to add all by doing:

  ```bash
  git add .
  ```

  The "." means everything in the current directory.

1. Tell **git** to **commit** the changes with a **m**essage describing what we are doing.

Now, we have the code for our site tracked.  We can share it on Github by:

1. Creating a new repo to match it on github.

1. Add the remote and push by using the code from the github page

1. Viola!

# Hosting our site on github

Something cool we can do, is tell github to host our site online for us. We can do this by:

1. Make a new branch locally called `gh-pages`

  ```bash
  git branch gh-pages
  ```

1. Checkout the `gh-pages` branch

  ```bash
  git checkout gh-pages
  ```

  Remember when we used the `checkout` command before to change timelines?  Here's we are making a new copy of our code, like making a new parallel universe based on our `master` version.

1. Push the `gh-pages` to github so that there is a `gh-pages` branch/parallel universe on github as well.

1. Github will then process our code, and host it at an address in this format:

  ```
  my-username.github.io/my-repo-name
  ```

That's it!  You're live and online!

![](http://media0.giphy.com/media/LeYFkniJST8wo/giphy.gif)


# Making Updates

1. Right now, we are in the `gh-pages` parallel universe.  We want to make updates through our `master` universe for now.  This means we need to switch ourselves back into `master`.

  ```bash
  git checkout master
  ```

1. Make updates to your site and save your code.

1. Track your change as before:

  ```bash
  git add .
  git commit -m "your descriptive message here"
  ```

1. Push these changes to our `remote`.

  ```bash
  git push origin master
  ```

  We can leave out the `-u` flag here.  That was a special flag we use for a new online repo.

1. Now if you refresh, your code should be updated!

# Merging changes into another branch

How do we make our hosted site update as well?  We need to combine changes from our `master` branch into our `gh-pages` branch and push the update online.

1. First, change into `gh-pages`

  ```bash
  git checkout gh-pages
  ```

1. Then, we can tell git to merge what is in `master` into where we are, `gh-pages`

  ```bash
  git merge master
  ```

1. The terminal will tell us that `master is merged into `gh-pages`.  That means the tracked changes we made on `master` have now been brought into `gh-pages` as well.

1. Push the updated `gh-pages` to our remote `gh-pages`

  ```bash
  git push origin gh-pages
  ```

1. Our site is updated!


# Review

## Terminal Commands

| Command     | What it means | What it does |
| ----------- | ------------- | ------------ |
| `pwd` | **p**rint **w**orking **d**irectory | Tells us where we are |
| `ls` | **l**i**s**t | List the things that are in this directory |
| `mkdir` | **m**a**k**e a **dir**ectory | make a new directory in we are |
| `cd hello`  | **c**hange **d**irectory | Move into the hello directory |
| `ls -a`     | **l**i**s**t  **a**ll | List all things that are in this directory |
| `explorer .`  | Open **explorer**| Open file **explorer** for this current directory |

## Git Commands

### Making a new repo locally

| Command     | What it means | What it does |
| ----------- | ------------- | ------------ |
| `git init`  | **git init**ialize | Start git tracking |


### Telling `git` to track a change

| Command     | What it means | What it does |
| ----------- | ------------- | ------------ |
| `git add hello.txt` | **git**, **add hello.txt** to your "stage" | tells git to keep an eye on the `hello.txt` file |
| `git commit -m "a message"` | **git**, **commit** these changes as described by this **m**essage | tells git to track the changes of the staged files and describes the change made |


### Handling versions

| Command     | What it means | What it does |
| ----------- | ------------- | ------------ |
| `git checkout ____` | **git**, **checkout** what's in _____ | switches us to a parallel universe where our files have a history up to the specified commit or branch |
| `git branch ____` | **git**, make a new **branch** with the name ____ | make a new parallel universe |
| `git merge ____` | **git**, **merge** ___ into my current version | smashes the ____ universe into our current universe |


### Putting our code online

| Command     | What it means | What it does |
| ----------- | ------------- | ------------ |
| `git remote add origin ______.git` | **git**, **add** this ____.git address as a **remote origin** | saves a reference to an online home named `origin` |
| `git push -u origin master` | **git**, **push** what you have tracked up as the master for `origin` | updates our `origin` online with the later tracked code on `mater` |


### Asking `git` for information

| Command     | What it means | What it does |
| ----------- | ------------- | ------------ |
| `git status`  | **git**, what's your **status**?  | tells us which files have changed since our last commit |
| `git diff` | **git**, tell us what's **diff**erent | shows us what has changed since our last commit |
| `git log` | **git**, give us a **log** | shows us a history of our commits |
| `git branch` | **git**, list us **branch**es | show us all the branches we've made and highlights the one we are in |
