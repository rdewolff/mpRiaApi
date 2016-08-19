#!/bin/sh

#
# Searches for nodes of instance AdrContactGrp.
#
# Available URL parameters:
# offset - the offset can be used for paging the result
# limit - to limit the number of nodes returned
# termContent - filters nodes by term content
# status - filters nodes by status (valid, candidate, refused)
# nodeName - filters nodes by logical name
#
# For vocabulary the default response type is application/xml
# But Accept application/json is also supported
#
curl -X "GET" "https://<host>/<application>/ria-ws/application/vocabulary/instances/AdrContactTypeVgr/nodes/search/?offset=0&limit=5&status=valid&nodeName=skype" \
	-u <Username>:<Password>
