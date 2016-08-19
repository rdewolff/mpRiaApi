See http://www.zetcom.com/ria/ws for a basic documentation.

The samples assume a common but individual application configuration. So
all the included modules and their fields must not necessarily be available
in your application.

All examples have to be edited to be runnable. The host name, application name
and user, password combination has to be changed.

-- Vocabulary --
To set vocabulary references you have to take a look at the definition of the
module first. At lease one of the samples sets a vocabulary reference of a
module named Address and a contained repeatable group named AdrContactGrp. The
following is a snippet from Address Module definition:

...
<repeatableGroup name="AdrContactGrp">
  <repeatableGroupItem>
    <dataField dataType="Clob" name="NotesClb"/>
    <dataField dataType="Long" name="SortLnu"/>
    <dataField dataType="Varchar" name="ValueTxt"/>
    <vocabularyReference name="TypeVoc" id="30116" instanceName="AdrContactTypeVgr"/>
  </repeatableGroupItem>
</repeatableGroup>
...

The snippet includes a vocabulary reference named TypeVoc and a corresponding
vocabulary instance name AdrContactTypeVgr. AdrContactTypeVgr is the
vocabulary instance whose nodes can be used for the reference TypeVoc.

To find out more about a specific vocabulary instance and its nodes,
check the samples starting with vocabulary.
