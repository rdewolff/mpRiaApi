#/bin/sh

#
# List all available exports for module Address
#
curl -X "GET" "https://<host>/<application>/ria-ws/application/module/Address/export" \
	-u <Username>:<Password>
