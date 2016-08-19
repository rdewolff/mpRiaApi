#/bin/sh

#
# Shows an expert search on the Address module using different filter criterias.
# See http://www.zetcom.com/ria/ws/module/search/search_1_4.xsd for the
# available search filters.
#
curl -X "POST" "https://<host>/<application>/ria-ws/application/module/Address/search" \
	-u <Username>:<Password> \
	-H "Content-Type: application/xml" \
	-d $'<?xml version="1.0" encoding="UTF-8"?>
<application xmlns="http://www.zetcom.com/ria/ws/module/search" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.zetcom.com/ria/ws/module/search http://www.zetcom.com/ria/ws/module/search/search_1_1.xsd"> 
  <modules> 
    <module name="Address"> 
      <search limit="10" offset="0">
				<expert>
					<and>
						<equalsField fieldPath="AdrCountryTxt" operand="Germany" />
						<isNotBlank fieldPath="AdrContactGrp.ValueTxt" />
						<equalsField fieldPath="AdrContactGrp.TypeVoc" operand="30150"/>
					</and>
				</expert>
			</search> 
    </module> 
  </modules> 
</application>'
