#!/bin/bash

rsync --delete -avz $1 --exclude=.git/ --exclude=*.sh ./ danbeamo@host240.hostmonster.com:~/www/ellipsis/
