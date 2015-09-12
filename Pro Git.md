#Pro Git

##Getting started

Git stores snapshots rather than an
original file with series of deltas.
To be efficient, if flies have not
changed at a commit, Git stores a 
link to the previous file rather than
storing the entire file again.  Git
thinks about its data as a series of
snapshots.

Git stores an entire repository, 
including history, locally.  So all
work can in theory be done without
any connection to any remote repo.

Generally, a Git repo can only have
data added to it.  Almost nothing 
you can do can remove data from the
repo, so data loss due to user error
is a highly unlikely scenario.

###The three states

**Committed** means a file is
safely stored in a repo.  **Modified**
means the file has changed from what
is committed.  **Staged** means a
modified file is flagged to be 
committed.  Commits are made into 
the git directory, `.git`, where all
objects and metadata are stored.  
The working directory is a single 
checkout of one version of the files.
When a repo is cloned, these files 
are pulled out of the compressed 
database in `.git` and placed in the
working directory for use or modification.
There is a staging area, which is 
actually a file (within `.git`) that
stores info about what will go into 
the next commit.  It is sometimes
referred to as the "index".  

A typical workflow involves:

1. Modify files in working directory
2. Stage the files, adding snapshots of the 
files to the staging area
3. Commit the files, which takes the 
files as staged, and stores them as
a permanent snapshot in the `.git`
directory.


###First-time Git setup

Git configuration can be stored in
three different places:

- `/etc/gitconfig` contains values for
every user and repo on the system.
Passing the `--system` option to 
`git config` causes configuration to
be stored here.
- `~/.gitconfig` or `$HOME\.gitconfig`
 contains values 
specific to a user.  Passing the `--global`
opton to `git config` causes this
location to be used.
- `./git/config` (a file named config
in the project's git directory) contains
values for that particular repo.

Each level overrides values in the 
previous level.

When Git is first installed, set the
username and email using:

```shell
git config --global user.name "John Doe"
git config --global user.email "johndoe@example.com"
```

Using the `--global` option ensures
that Git will use the info for all
repos that the user touches.  Of
course it can be overridden for a
repo by using `git config` at that
repo without the `--global` option.

Check the settings configured using
`git config --list`.  If keys are 
listed more than once it is because
they are being read in multiple 
locations, in which case, the later
value for the key wins.


###Getting help

Get help using:

```shell
git help <verb>
```

For instance:

```shell
git help config
```

This opens an HTML file in the app
that is configured to open the file
type which is quite stupid because
on developer PCs it will often open
the HTML in an editor or IDE.  This
apparently is something that cannot
be fixed on Windows.  

https://groups.google.com/d/msg/msysgit/bBVP3DKyKzc/fpzK8moJXOgJ


##Git basics

