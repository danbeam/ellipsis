#!/bin/bash

YUI=$(which yui);
[ "$?" -ne "0" ] && echo "You need yui on your path!" && exit 1;

$YUI --type js --preserve-semi jquery/jquery.ellipsis.js -o jquery/jquery.ellipsis.min.js 
$YUI --type js --preserve-semi yui/yui.ellipsis.js -o yui/yui.ellipsis.min.js
