# Contributing to AgileLine

Welcome to my team's project! First of all, we - the project development team, would like to express our gratitude to you for your interest and willingness to contribute to this open-source project.

# Introduction

This is an open-source project with the goal of helping people manage their tasks more effectively. The website provides team management tools, project management tools, and issue tracking to maximize the productivity of individuals or organizations.

# How to contribute

We understand that you want to contribute to this project to help improve it quickly. However, you need to adhere to our product development process to achieve the best efficiency and avoid conflicts with others' code.

## Receive an issue to work on

Please follow the requirements below to ensure that your contribution process is helpful.

1. Go to the [issues page](https://github.com/loozzi/agile-line/issues/) and select an issue that matches your abilities and has not been assigned to anyone yet.
2. When you have selected a suitable issue, please leave a comment below the comments section so that the team can assign that issue to you.
3. Wait until a team member replies to your comment and assigns the issue to you.
4. Let's start contributing!

## Clone repository to contribute

1. First, you need to Fork the repository to your own repository.

   Navigate to the original repository [here](https://github.com/loozzi/agile-line). Click on the **Fork** button at the top-right corner of the repository and wait for GitHub to copy the original repository to your personal account.

   You will be redirected to a repository similar to the original repository with your username as the owner.

2. Next, you need to clone the repository to your machine for convenience.

   Navigate to the location where you want to store the repository on your personal computer, open the terminal here, and execute the following command with <URL> being the repository link you forked above.

   ```
   git clone <URL>
   ```

   Wait for Git to clone the entire repository to your machine. Then, navigate your terminal into the directory containing the repository:

   ```
   cd agile-line
   ```

3. Create a new branch (development branch) for the repository.

   When you clone the repository, you will be defaulting to the `master` branch. Your changes in this repository should be in a new 'on-the-spot' branch.

   When you're in the directory containing the repository, execute the following command to create a new branch with `<BRANCH-NAME>/<ISSUE-ID>` representing the issue you're preparing to contribute to. For example: `feature/70`, `bugfix/32`,...

   ```
   git checkout -b <BRANCH-NAME>/<ISSUE-ID>
   ```

4. Let's get started!

## Commit & Push

### Commit

After completing the changes, you need to commit these changes using the following commands:

```
git add <FILE-Name>
git commit -m <MESSAGE>
```

with

- `<FILE-NAME>` as the path to the edited file(s). The quickest way to obtain the path to the file is to use the `git status` command. This command will display the files that have been modified or newly added under the `Modified` or `Untracked` section.
- `<MESSAGE>` as the description for the purpose of the edits you have made. [(Docs)](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)

#### Note:

> Committing should not be done while you're on the `master` branch. Check the current branch you're on using the command `git branch`. If you're still on the `master` branch, you may not have run the `git checkout` command in the previous section.

> Before committing, you always need to specify the files to be included in the commit. This is done using the `git add` command.

> Committing can be done multiple times within a translation. Whenever a file is modified, you must use the `git add` command before making a new commit.

### Push

After completing the translation of a document, you need to push the changes you made to your GitHub repository. This is done using the following command, with `<BRANCH-NAME>` being the name of the branch you initially set.

```
git push origin <BRANCH-NAME>
```

The quickest way to view the current branch name is to use the `git branch` command, and your current branch name will be marked with an asterisk `*`. If you're using Git Bash terminal, your branch name will be displayed at the end of your name.

#### Note:

> You should not run the command `git push origin master` to push your edits to the `master` branch. Instead, you should only push to your own branch.

## Create Pull Request

The final step in this process is to create a Pull Request (PR) to submit your translation to the official repository from your repository. This is very straightforward and is done through the GitHub website.

1. Navigate to the original repository [here](https://github.com/loozzi/agile-line).
2. If you have pushed commits from your machine to the repository you own, GitHub will display a line of light yellow background notification just below the description of the repository. Click on the green **Compare and Pull Request** button at the end of the notification line. You will be directed to the PR creation page.
3. Enter the title of the PR and a description of the significant changes you have made (if necessary).
4. After entering the title and description for the PR, make sure that...

   - The base branch displays the value `master`.
   - The compare branch displays the value `<GITHUB-USERNAME>/<BRANCH-NAME>`.

   This means you are creating a Pull Request to request merging changes from your new branch in the repository you own into the `master` branch of the original repository.

5. After ensuring that all fields have been filled in properly, click the **Create a Pull Request** button.

6. Finally, the pull request for the changes you made has been created. Please wait for the team to review and merge it into the official repository.

## Review & Merge

When your PR is created, the team will take time to review it and ensure that your contribution is appropriate. If the team wants to suggest edits to your contribution, we will comment on your PR with those suggestions.

After reviewing the feedback and making necessary adjustments, commit the changes and push them to your repository. Your PR will be automatically updated with the changes you just made.

If your PR is accepted, the team will merge your changes into the main repository. You will be notified when this process is complete.

## Let's get started! 🏃🎉

If you've read this far, what are you waiting for? Pick an issue and start contributing to the project now!
