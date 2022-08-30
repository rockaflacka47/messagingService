#!/usr/bin/env bash
if [[ -z $1 ]]; then 
    echo "please add a commit message"
    exit 1
fi
echo $1

echo $2

if [[ $2 ]]; then
        echo "adding all"
        git add *
else
    echo "adding tracked"
    git add -u
fi

git commit -m "$1"

git push