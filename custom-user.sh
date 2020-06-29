#!/bin/bash
set -e

if [ -n "$MONGO_NON_ROOT_USERNAME" ] && [ -n "$MONGO_NON_ROOT_PASSWORD" ]; then
  "${mongo[@]}" "$MONGO_INITDB_DATABASE" <<-EOJS
    db.createUser({
      user: $(_js_escape "$MONGO_NON_ROOT_USERNAME"),
      pwd: $(_js_escape "$MONGO_NON_ROOT_PASSWORD"),
      roles: [ { role: 'readWrite', db: $(_js_escape "$MONGO_INITDB_DATABASE") } ]
    })
EOJS
fi
