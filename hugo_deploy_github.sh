#!/bin/bash
rm -rf public/*
hugo
cp CNAME public/CNAME
echo "gitdir: ../.git/modules/public" > public/.git
cd public
git add -A
git commit -m "Built website $(date +%F)"
git push origin main --force