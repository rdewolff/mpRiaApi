#!/bin/sh

#
# This request returns the definition of the Address module
#
curl -X "GET" "https://<host>/<application>/ria-ws/application/module/Address/definition" \
	-u <Username>:<Password>
