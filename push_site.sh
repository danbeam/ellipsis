#!/bin/bash

rsync --delete -avz --exclude=.git/ --exclude=*.sh . danbeamo@host240.hostmonster.com:~/www/ellipsis/
