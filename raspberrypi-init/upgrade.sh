#! /bin/bash

githublink=`git config --get remote.origin.url`

## run this script to grab the latest verions of the Rubik's Clock

   cat << HEREDOC

We are about to grab the latest version of the Rubik's clock from here:

$githublink


HEREDOC

while true; do
    read -p "Ok to upgrade to the latest? [Y or N] " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) echo; echo "Aborting the upgrade"; exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

git pull
