#!/bin/sh

#
# Uploads an attachment to the Multimedia record 70078. 
#
curl -X "PUT" "https://<host>/<application>/ria-ws/application/module/Multimedia/70078/attachment" \
  -u <Username>:<Password> \
  -H "X-File-Name: <document>.<extension>" \
	-H "Content-Type: application/octet-stream" \
	--data-binary "@<path-to-file>"
