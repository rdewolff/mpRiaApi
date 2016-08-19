#!/bin/sh

#
# Add a record of type Address
#
curl -X "POST" "https://<host>/<application>/ria-ws/application/module/Address/" \
	-u <Username>:<Password> \
	-H "Content-Type: application/xml" \
	-d $'<application xmlns="http://www.zetcom.com/ria/ws/module">
  <modules>
    <module name="Address">
      <moduleItem>
        <dataField name="AdrPostcodeTxt">
          <value>12345</value>
        </dataField>
        <dataField name="AdrSurNameTxt">
          <value>Muster</value>
        </dataField>
        <dataField name="AdrStreetTxt">
          <value>Köpenickerstr. 154</value>
        </dataField>
        <dataField name="AdrCityTxt">
          <value>Berlin</value>
        </dataField>
        <dataField name="AdrForeNameTxt">
          <value>Max</value>
        </dataField>
        <dataField name="AdrCountryTxt">
          <value>Germany</value>
        </dataField>
        <dataField dataType="Varchar" name="AdrCountyTxt">
          <value>Berlin</value>
        </dataField>
        <vocabularyReference name="AdrSendEmailVoc">
          <vocabularyReferenceItem id="30891" />
        </vocabularyReference>
        <vocabularyReference name="AdrSendPostVoc">
          <vocabularyReferenceItem id="30891" />
        </vocabularyReference>
        <repeatableGroup name="AdrContactGrp">
          <repeatableGroupItem>
            <dataField name="ValueTxt">
              <value>max.muster@gmail.com</value>
            </dataField>
            <vocabularyReference name="TypeVoc">
              <vocabularyReferenceItem id="30152" />
            </vocabularyReference>
          </repeatableGroupItem>
          <repeatableGroupItem>
            <dataField name="ValueTxt">
              <value>(555)555-5555</value>
            </dataField>
            <vocabularyReference name="TypeVoc">
              <vocabularyReferenceItem id="30150" />
            </vocabularyReference>
          </repeatableGroupItem>
        </repeatableGroup>
        <moduleReference name="AdrAddressGroupRef">
          <moduleReferenceItem moduleItemId="12011" />
        </moduleReference>
      </moduleItem>
    </module>
  </modules>
</application>'
