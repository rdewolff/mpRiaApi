#!/bin/sh

#
# Updates a repeatable group item of type AdrContactGrp with id 34025
# of the Address with id 29011
#
curl -X "PUT" "https://<host>/<application>/ria-ws/application/module/Address/29011/AdrContactGrp/34025" \
	-u <Username>:<Password> \
	-H "Content-Type: application/xml" \
	-d $'<application xmlns="http://www.zetcom.com/ria/ws/module">
  <modules>
    <module name="Address">
      <moduleItem id="29011">
        <repeatableGroup name="AdrContactGrp">
          <repeatableGroupItem id="34025">
            <dataField name="ValueTxt">
              <value>max_muster_73</value>
            </dataField>
          </repeatableGroupItem>
        </repeatableGroup>
      </moduleItem>
    </module>
  </modules>
</application>'
