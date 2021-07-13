#!/bin/sh
# `/sbin/setuser node` runs the given command as the user `node`.
# If you omit that part, the command will be run as root. https://gist.github.com/scr1p7ed/ee0d96c3795e59244063
cd /var/www/node
pm2 start npm  --max-memory-restart 200M --name "tsoa-seed" -l /var/log/nodejs/pm2.log --no-daemon -u node -- start
