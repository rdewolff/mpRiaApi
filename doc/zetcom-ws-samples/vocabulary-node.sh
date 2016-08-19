#!/bin/sh

#
# Retrieve information for a vocabulary node with id 30891 of the
# vocabulary instance GenYesNoVgr
#
# For vocabulary the default response type is application/xml
# But Accept application/json is also supported
#
curl -X "GET" "https://<host>/<application>/ria-ws/application/vocabulary/instances/GenYesNoVgr/nodes/30891" \
	-u <Username>:<Password>
