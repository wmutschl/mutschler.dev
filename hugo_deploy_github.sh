#!/bin/bash
rm -rf public/*
hugo
cp CNAME public/CNAME
cd public
git add -A
git commit --amend -m "Built website $(date +%F)"
git push origin main --force