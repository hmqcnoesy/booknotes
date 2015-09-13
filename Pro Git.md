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
$ git config --global user.name "John Doe"
$ git config --global user.email "johndoe@example.com"
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
$ git help <verb>
```

For instance:

```shell
$ git help config
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

###Initializing a repository in an existing directory

To start a repo from an existing folder:

```shell
$ git init
```

This will create the `.git` subfolder, but
not start tracking anything.  To clone an
existing repo, use:

```shell
$ git clone http://github.com/libgit2/libgit2
```

This creates a copy of the entire repo,
including all files' version history, in
the current working directory (in a subfolder
named libgit2).  The cloned
repo is so complete that if the server were
to be lost, it could be perfectly reconstructed
from repos stored on clients. 

The `git clone` command creates the `.git`
subfolder in its entirety and "checks out"
the latest copy - that is it creates a copy
in the working folder, ready for modification.

To check status of files in a repo, use:

```shell
$ git status
```

A "nothing to commit, working directory clean"
message indicates that no tracked files are
modified, and there are no untracked files
(unless they are explicitly ignored).

Adding a file will result in a new untracked
file when running `git status`:

```shell
$ echo "New stuff" > new.txt
$ git status
On branch master
Untracked files:
  (use "git add <file>..." to include what will be committed)
  
    new.txt
	
```

This message means Git sees the file, but 
has not been instructed to track it as 
part of the repo, and won't include it in
a commit until told to.  This is the default
behavior so that binary files or other
artifacts are not automatically included in
commits.  To start tracking the untracked
file, use `git add <f>` where f is a file
or a directory (in which cases all files
below will be added):

```shell
$ git add new.txt
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)
  
    new file:    new.txt
```

Now the file is staged.  If committed now,
the version of the file that was staged
will be added to the repo.

Likewise, a file that is already tracked,
once modified, will show its status as
"Changes not staged for commit".  The
`git add` command works here to stage the
modified file. If a change is made to a 
staged file after it is staged, `git status`
will report the file has both changes to
be committed, and changes not staged for
commit:

```shell
$ vim file.txt
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)
  
    modified:    file.txt
	
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)
  
    modified:    file.txt
```

The staged copy is the version of the file
exactly as it was when the `git add` command
was executed.  The working copy is detected
as having changed and so is listed as an
unstaged modification.  To get the current
version staged for commit, simply 
`git add` again.

A less wordy alternative to `git status` is
`git status -s`:

```shell
$ git status -s
 M README
MM Rakefile
A  lib/git.rb
M  lib/simplegit.rb
?? LICENSE.txt
```

To tell Git to ignore files, create a
`.gitignore` file:

```
#contents of .gitignore
*.[oa]
*~
```

In the above example, all files ending
in `.o` and `.a` are ignored, as well 
as files ending in `~`.  Pattern rules are
as follows:

- Blank lines or lines starting with `#`
are ignored
- Standard glob patterns work
- End a pattern with a `/` to specify a directory
- Negate a pattern by starting with `!`

Glob patterns are simplified regex that
shells use:

- `*` matches zero or more chars
- `[abc]` matches a, b, or c
- `?` matches a single char
- `[0-9]` matches a single char between 0 and 9

Use `git diff` to see actual changes to files
that are unstaged.  Use `git diff --staged`
to see staged differences.  This sucks in a
terminal window and is best left to graphical
tools.


###Committing your changes

Once the staging version is set up correctly,
it is time to commit - saving a permanent
snapshot of the files as staged:

```shell
$ git commit
```

This opens the default text editor, prompting
for the commit comments.  When the editor is
exited, Git creates the commit snapshot along
with the message saved.  A commit message
can be included inline as well, using the 
`-m` option:

```shell
$ git commit -m "git sucks"
```

###Skipping the staging area

A shortcut to skip the staging area:

```shell
$ git commit -a -m "git sucks"
```


###Removing files

To remove a file from a repo, it must
be removed from tracked files:

```shell
$ rm unwanted.txt
$ git rm unwanted.txt
```

The above stages the removal, which then 
must be committed.


###Moving files

Git doesn't track file movement.  Renaming
a file is essentially the same as deleting
the original file and creating a new file
with the new name.  So the `git mv` 
command:

```shell
$ git mv file_from file_to
```

is really the same as:

```shell
$ git rm file_from
$ git add file_to
``` 

Although `git status` in both cases can
detect that it is the same file, and will
show the status as having been renamed.
Go figure.


###Viewing the commit history

Run `git log` to view a list of commits
with their messages, in reverse chronological
order.

The `p` option shows differences.  The `-2`
option limits to the last 2 commits.
The `--pretty=format:"<format>"` option can
use a format specifier to output exactly 
the info needed.  Format specifiers can
contain options like `%H` for commit hash,
`%an` for author name, `%cn` for committer
name, and `%s` for subject.

There are a plethora of additional options
for `git log`, none of which are anywhere
near as useful as a simple graphical tool
for viewing or comparing history.

###Undoing things

