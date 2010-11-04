#!/bin/bash

YUI=$(which yui);
[ "$?" -ne "0" ] && echo "You need yui on your path!" && exit 1;

( head -19 jquery/jquery.ellipsis.js && echo -n ";" && $YUI --type js --preserve-semi jquery/jquery.ellipsis.js ) > jquery/jquery.ellipsis.min.js
( head -19 yui/yui.ellipsis.js && echo -n ";" && $YUI --type js --preserve-semi yui/yui.ellipsis.js ) > yui/yui.ellipsis.min.js
