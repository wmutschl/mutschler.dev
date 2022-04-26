#!/bin/bash
hugo
rsync -avuP --delete public/ mutschler.dev:/home/wmutschl/docker/swag/www/
