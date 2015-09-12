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