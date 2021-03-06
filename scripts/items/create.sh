#!/bin/bash

API="http://localhost:4741"
URL_PATH="/items"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "item": {
      "name": "'"${NAME}"'",
      "notes": "'"${NOTES}"'",
      "active": "'"${ACTIVE}"'"
      "private": "'"${PRIVATE}"'"
    }
  }'

echo
