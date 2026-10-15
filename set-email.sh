#!/bin/sh
# Использование: sh set-email.sh you@example.com
[ -z "$1" ] && echo "укажите email" && exit 1
sed -i "s/FION_EMAIL/$1/g" privacy.html terms.html community.html delete-account.html pricing.html refunds.html
grep -l FION_EMAIL *.html || echo "email подставлен везде"
