#!/bin/sh

#
# This request returns the definition of the AddressGroup module
#
curl -X "GET" "https://<host>/<application>/ria-ws/application/module/AddressGroup/definition" \
	-u <Username>:<Password>
