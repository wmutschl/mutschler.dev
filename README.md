I am using the [Academic Theme](https://github.com/wowchemy/starter-hugo-academic) for [Hugo](https://github.com/gohugoio/hugo) for my technical homepage located at <https://mutschler.dev> and [deploy it using GitHub pages](https://wowchemy.com/docs/hugo-tutorials/deployment/#github-pages).

This repository contains all content on the homepage and two useful scripts:

* `update_hugo_extended.sh`: downloads the most recent version of Hugo Extended binary and copies it over to $HOME/.local/bin (make sure it is in your $PATH)
* `hugo_deploy_github.sh`: git commands I use to deploy to GitHub pages (note that public is a submodule)