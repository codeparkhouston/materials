Let's first try a few things in this "Terminal".

## First commands

1. We ask the computer where we are by typing

  ```bash
  pwd
  ```

  Press <kbd>Enter</kbd> to run the command.

  This stands for ** p ** rint ** w ** orking ** d ** irectory.  The terminal has automatically put us in our "home" folder, or directory.

1. Let's ask the computer to ** l ** i** s ** t what we have in this directory by typing

  ```bash
  ls
  ```

  Once again, press <kbd>Enter</kbd> to run the command.

1. Neat! Let's ** m ** a** k ** e a ** dir ** ectory by typing and running

  ```bash
  mkdir hello
  ```

1. Type and run

  ```bash
  ls
  ```

  again.  You should see ```hello``` listed in the results.

***Congratulations! You've used some of the more common commands of working in the terminal. Armed with these incantations, you're well on your way to becoming a hacker.***

| Command | What it means | What it does |
| -- | -- | -- |
| `pwd` | ** p ** rints&nbsp;&nbsp;** w ** orking&nbsp;&nbsp;** d ** irectory | Tells us where we are |
| `ls` | ** l ** i** s ** t | List the things that are in this directory |
| `mkdir` | ** m ** a ** k ** e&nbsp;&nbsp;** dir ** ectory | make a new directory in we are |

![Feel the power...](http://cdn.pastemagazine.com/www/blogs/awesome_of_the_day/harry%20potter%20animated%20gif.gif)

## First git repository

1. We want to make this our first "git repository," which is a fancy way to say, we are going to make this "hello" directory trackable and shareable.

  To do things to this directory, we need to be in the directory.  We can ** c ** hange ** d ** irectory into ```hello``` by typing and running

  ```bash
  cd hello
  ```

1. Now, we are in the ```hello``` directory.  If we

  ```bash
  pwd
  ```

  again, we will see a path like before, but with `/hello` at the end.  Also, if we

  ```bash
  ls
  ```
  we won't see any files or directories listed.

1. We are ready.  Let's type and run

  ```bash
  git init
  ```

  This will ** init ** ialize the `hello` directory that we are in to be tracked.

  In fact, your terminal should tell you something like:

  *Initialized empty Git repository in /Users/pandafulmanda/hello/.git/*

  If you list what is in your directory, it won't look any different. But if you try

  ```bash
  ls -a
  ```

  you should see something that says `.git`.  This is the secret folder that `git` will use to keep our work safe in this directory! We had to give our `list` command a special `-a` flag, for ** a ** ll, to reveal it.

  ![A secret door!](https://31.media.tumblr.com/d2cac9af6eec29f71f477d07d81cbaa6/tumblr_inline_n8pnawVld71ruskat.gif)

1. Let's make a new file to test out this git thing.  We can open the "explorer" for this directory by typing

  ``` bash
  explorer .
  ```

1. We can right click on the explorer and make a new text file.  Let's call it `hello.txt`.

1. Double click `hello.txt` to edit it.  We can update it to say, "Hello world!", for example.  Now, if we `ls`, we should see that `hello.txt` is in this `hello` directory.

1. We can see if `git` has detected any changes by typing and running

  ```bash
  git status
  ```

1. We see that `git` knows about `hello.txt`, but is it "untracked."  This means that git is not yet tracking the changes in this file.  We have to tell git to ** add ** this file to a list of files it'll keep an eye on.

  ```bash
  git add hello.txt
  ```

1. Let's ask `git` again what it sees.

  ```bash
  git status
  ```

1. Notice how our file when from red to green?  Git is letting us know that it's ready to track changes in `hello.txt`.  We can tell git to save, or ** commit ** our changes to it's memory, with a ** m ** essage describing what we did.

  ```bash
  git commit -m "Starting our hello"
  ```

  Once git has done this, it'll tell us what it tracked:

  1 file changed, 1 insertion(+)
  create mode 100644 hello.txt

  Cool!  We can say `git status` again and see that git has not detected any changes since we last saved.

  *You may have noticed, as we work with git, we ask git to do things by typing `git` and then what we want git to do following that.*

1. Let's make a change in our `hello.txt` and see what git has to say about that.  Go to your `hello.txt` and update it to say

  Hello world, I am learning git!

  Now, in the terminal, let's ask git what it sees with

  ```bash
  git status
  ```

1. Git sees that we modified the file.  In fact, git can tell us exactly what is ** diff ** erent.  Try

  ```bash
  git diff
  ```

1. Let's tell git to track these changes, like before.

  ```bash
  git add hello.txt
  git commit -m "update our hello"
  ```

  When we `git add`, we are adding our files we want to something call a `stage`.  This stage is really powerful.  When we have many more files, and want only changes to certain files to be committed, we can choose to only stage those.  This way, git gives you a chance to add changes to files slowly, and then collect one big list of changes and give it an explanation in the commit message.

1. We ask git to tell us the history of our directory by giving us a ** log ** of what has happened so far.

  ```bash
  git log
  ```

  Here, we see some really neat information about our changes.  Git lists our most recent changes at the top with the message we used to describe this change, the time we committed the change, and a [crazy looking long string](http://alblue.bandlem.com/2011/08/git-tip-of-week-objects.html) that refers to each specific change we told it to track.  These descriptions of changes come in very handy as code projects grow and when we need to understand what we did a long time ago or what changes someone else made.

1. This is where we can do some crazy things that would be hard and messy to do without it. We can go back to a specific point in the history of our file by telling git to ** checkout ** that specific commit.  We can go back to the "Starting our hello" commit by copying the crazy string and putting it into this next command:

  ```bash
  git checkout 76036e81bacd14180e6b7709a8738772e798de2c
  ```

  Now, if we look at our file, it's rewound itself back to that point in history!  If we had made a lot more changes throughout the existence of this file, we could go back to an exact point without ```ctrl + z```ing a bajillion times back to that point.  It's like have a smart time-machine for our code.

  ![Back to the future!](http://theextraordinarysomething.com/wp-content/uploads/2013/11/back-to-the-future-gif.gif)

1. At this point, we could change our code and make a parallel universe where we edit our hello.txt into something else altogether, but we'll get to that another day.  Let's go back to where we were so we get this thing online and share it!

  ```bash
  git checkout master
  ```

  Master is the "master" version of our directory.  It will change us back into our original timeline.  Now if we check the contents of our file, we see it with the latest content.


***We've just made our first git repository, tracked it's changes, and even saw how to look at a file's history and change timelines!***

| Command | What it means | What it does |
| -- | -- | -- |
| `cd hello` | ** s ** hage&nbsp;&nbsp;** d ** irectory | Move into the hello directory |
| `git init` | ** git init ** &nbsp;&nbsp;ialize | Start git tracking |
| `ls -a` | ** l ** i** s ** t  ** a ** ll | List all things that are in this directory |
| `explorer .` | Open ** explorer ** | Open file ** explorer ** &nbsp;&nbsp;for this current directory |
| `git status` | hey ** git ** ,&nbsp;&nbsp; what's your status?  | tells us which files have changed since our last commit |
| `git add hello.txt` | hey ** git ** ,&nbsp;&nbsp; ** add hello.txt ** to your "stage" | tells git to keep an eye on the `hello.txt` file |
| `git commit -m "a message"` | hey ** git ** ,&nbsp;&nbsp; ** commit ** &nbsp;&nbsp; these changes as described by this message | tells git to track the changes of the staged files and describes the change maded |
| `git diff` | hey ** git ** ,&nbsp;&nbsp; tell us what's ** diff ** erent | shows us what has changed since our last commit |
| `git checkout ____` | hey ** git ** ,&nbsp;&nbsp; ** checkout ** &nbsp;&nbsp; what's in _____ | switches us to a parallel universe where our files have a history up to the specified commit |

![Turning back time](http://blogjob.com/underthesun/files/2014/08/fanpop-time-turner.gif)
