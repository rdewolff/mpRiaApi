#!/bin/sh

#
# The following request returns an xml file including the full definition of
# all domain modules included in this application.
#
curl -X "GET" "https://<host>/<application>/ria-ws/application/module/definition" \
  -u <Username>:<Password>
