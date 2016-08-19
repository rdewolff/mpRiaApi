#!/bin/sh

#
# Search for all Addresses and select only chosen fields of the Address.
# Selecting fields makes sense cause it limits bandwidth and increases
# performance especially when references are not needed.
#
curl -X "POST" "https://<host>/<application>/ria-ws/application/module/Address/search" \
	-u <Username>:<Password> \
	-H "Content-Type: application/xml" \
	-d $'<?xml version="1.0" encoding="UTF-8"?>
<application xmlns="http://www.zetcom.com/ria/ws/module/search" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.zetcom.com/ria/ws/module/search http://www.zetcom.com/ria/ws/module/search/search_1_1.xsd"> 
  <modules>
    <module name="Address">
      <search limit="10" offset="0">
				<select>
					<field fieldPath="__id"/>
					<field fieldPath="AdrSurNameTxt"/>
					<field fieldPath="AdrForeNameTxt"/>
					<field fieldPath="AdrContactGrp"/>
					<field fieldPath="AdrContactGrp.repeatableGroupItem"/>
					<field fieldPath="AdrContactGrp.ValueTxt"/>
					<field fieldPath="AdrContactGrp.TypeVoc"/>
					<field fieldPath="AdrAddressGroupRef"/>
					<field fieldPath="AdrAddressGroupRef.moduleReferenceItem" />
					<field fieldPath="AdrAddressGroupRef.formattedValue"/>
				</select>
				<fulltext>*</fulltext>
			</search> 
    </module>
  </modules>
 </application>'
