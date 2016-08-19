#!/bin/sh

#
# Retrieve instance information for the vocabulary GenYesNoVgr.
# For an information about what vocabulary instances are available, check
# the module definition. Modules that contain vocabulary reference fields have
# their vocabulary instance name attached.
#
# For vocabulary the default response type is application/xml
# But Accept application/json is also supported
#
curl -X "GET" "https://<host>/<application>/ria-ws/application/vocabulary/instances/GenYesNoVgr" \
	-u <Username>:<Password>
