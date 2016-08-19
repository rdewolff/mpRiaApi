#!/bin/sh

#
# Download Export with id 4007 of Address with id 29011
# curl -O -J writes the resulting document to disk.
#
curl -O -J -X "GET" "https://<host>/<application>/ria-ws/application/module/Address/29011/export/4007" \
  -u <Username>:<Password>
