# upgradeAdvisoryHelper

Main idea behind of UAHelper is to have an access to the structured storage of Genesys release notes to ease the burden of creation of upgrade advisory documents for support acrhitects.

main idea:
- scrape documentation website for details of release notes and put it into database
- create webinterface to allow the user to enter its customer db details
- run server side script to pull the components versions from configuration db and compare it against db of parsed component release notes
- create a json file with such details like latest release, delta between latest release and customer release, etc
- create docx file based on generated JSON and docx template file. 

Used technologies:
- Chrome webscrapper.io extension to parse docs.genesyslab.com/documentation and put it into CouchDB (only supported dbms)
- node.js to handle web requests and work with CouchDB
- docxtemplater to create docx files based on clients json and clients docx template file. 
(http://docxtemplater.readthedocs.io/en/latest/)

example structure of JSON to be fed to docxtemplater (supported tags)
```javascript
{  components: [
    {
      component: 'Interaction Server',
      releases: [
        {
          release: '2222',
          family: '9',
          date: '12/12/87',
          release_type: 'General',
          restricted: true,
          aix: true,
          linux: false,
          solaris: false,
          windows: true,
          features: [
            "Abracadabra",
            "sim salabim"
          ],
          issues: [
            "It's all bad",
            "this one is even worse"
          ]
        }
      ],
      current_release: [
          {
            release: '2222',
            family: '9',
            date: '12/12/87',
            release_type: 'General',
            delta_latest_release: 20,
            delta_same_family: 1            
          }
      ],
      latest_same_family: {
        release: '2222',
        family: '9',
        date: '12/12/87',
        release_type: 'General'
      },
      latest_release: {
        release: '2222',
        family: '9',
        date: '12/12/87',
        release_type: 'General'
      },
    }
  ]
};
```
All the JSON branch names could be used as tag names in docx template file (see example in input.docx) 
