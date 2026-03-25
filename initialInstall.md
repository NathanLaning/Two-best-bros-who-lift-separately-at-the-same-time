
### Repository install for collaborators

```bash
sudo apt install gh
gh auth login


```
Follow login steps in browser (hopefully it works but if not it should give you a link to open), then...

```bash
git config --global user.email "youremail@website.com"
gh repo clone NathanLaning/Two-best-bros-who-lift-separately-at-the-same-time
cd Two-best-bros-who-lift-separately-at-the-same-time/
```

Where youremail should match the GitHub email that it is attached to

### Checkout/commit Branch For Making Changes

```bash
git checkout -b NewBranchName
```
Where you would replace NewBranchName with a real branch name (FixIssue_102__3_3_26 for example)

```bash
git add .
```
Adds any new files (only necessary when doing so)
### running the thing

docker-compose up