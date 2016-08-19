#/bin/sh

#
# Downloads an attachment from the Multimedia record 70078
#
curl -O -J -X "GET" "https://<host>/<application>/ria-ws/application/module/Multimedia/70078/attachment" \
	-u <Username>:<Password> \
	-H "Accept: application/octet-stream"
