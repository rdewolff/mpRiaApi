#/bin/sh

#
# Delete a repeatable group item of type AdrContactGrp with id 34025
# of Address 29011
#
curl -X "DELETE" "https://<host>/<application>/ria-ws/application/module/Address/29011/AdrContactGrp/34025" \
	-u <Username>:<Password>
