#/bin/bash

echo "Enter Team number: "
read t
echo "Enter Project number: "
read p

cd ~/Terraform
mkdir gitlab2
cd gitlab2

git clone https://github.com/jdiggity22/CAMLabs.git
cd CAMLabs
rm -rf .git
git init
git remote add origin ssh://git@gitlab.10.10.1.4.nip.io:2222/labadmin/team$t-project$p.git
git add .
git commit -m "Initial commit"
git push -u origin master
