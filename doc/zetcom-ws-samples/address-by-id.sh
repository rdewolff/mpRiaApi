#!/bin/sh

#
# Returns a complete record of type Address with the id 9015
#
curl -X "GET" "https://<host>/<application>/ria-ws/application/module/Address/9015" \
  -u <Username>:<Password>
