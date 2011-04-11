#!/bin/bash

YUI=$(which yui);
[ "$?" -ne "0" ] && echo "You need yui on your path!" && exit 1;

echo -n "jQuery version...";
( head -19 jquery/jquery.ellipsis.js && echo -n ";" && $YUI --type js --preserve-semi jquery/jquery.ellipsis.js ) > jquery/jquery.ellipsis.min.js
[ "$?" -eq "0" ] && echo "[ OK ]" || echo "[FAIL]";

echo -n "YUI3 version...";
( head -19 yui/yui.ellipsis.js && echo -n ";" && $YUI --type js --preserve-semi yui/yui.ellipsis.js ) > yui/yui.ellipsis.min.js
[ "$?" -eq "0" ] && echo "[ OK ]" || echo "[FAIL]";
