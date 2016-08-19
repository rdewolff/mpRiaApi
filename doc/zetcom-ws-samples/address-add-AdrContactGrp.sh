#!/bin/sh

#
# Adds a repeatable group item of type AdrContactGrp to a given Address with
# id 29011
#
curl -X "POST" "https://<host>/<application>/ria-ws/application/module/Address/29011/AdrContactGrp" \
	-u <Username>:<Password> \
	-H "Content-Type: application/xml" \
	-d $'<application xmlns="http://www.zetcom.com/ria/ws/module">
  <modules>
    <module name="Address">
      <moduleItem id="29011">
        <repeatableGroup name="AdrContactGrp">
          <repeatableGroupItem>
            <dataField name="ValueTxt">
              <value>max_muster</value>
            </dataField>
            <vocabularyReference name="TypeVoc">
              <vocabularyReferenceItem id="30158" />
            </vocabularyReference>
          </repeatableGroupItem>
        </repeatableGroup>
      </moduleItem>
    </module>
  </modules>
</application>'
