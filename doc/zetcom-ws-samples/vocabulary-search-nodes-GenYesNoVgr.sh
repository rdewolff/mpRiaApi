#!/bin/sh

#
# Search for all nodes of vocabulary instance GenYesNoVgr
#
# For vocabulary the default response type is application/xml
# But Content-Type application/json is also supported
#
curl -X "GET" "https://<host>/<application>/ria-ws/application/vocabulary/instances/GenYesNoVgr/nodes/search/" \
  -u <Username>:<Password>
