class Result {
    constructor(result) {
        this.result = result;
    }

    display(result) { }
}

class OracleDBResult extends Result {
    constructor(result) {
        super(result);
    }

    display(response) {
        response.write("<table>");
        var result = this.result;
        // Column Title
        if (result.metaData && result.rows) { // results in array form (from oracle driver)
            response.write("<tr>");
            for (var col = 0; col < result.metaData.length; col++) {
                response.write("<th>" + result.metaData[col].name + "</th>");
            }
            response.write("</tr>");

            // Rows
            for (var row = 0; row < result.rows.length; row++) {
                response.write("<tr>");
                for (col = 0; col < result.rows[row].length; col++) {
                    response.write("<td>" + result.rows[row][col] + "</td>");
                }
                response.write("</tr>");
            }
            response.write("</table>");
        }
    }
}

class CouchDBResult extends Result {
    constructor(result) {
        super(result);
    }

    display(response) {

        var result = this.result;

        if (result[0].key) { // results in Object form (from couchdb)
            response.write("<table>");
            //Column Title
            response.write("<tr>");
            var columns = result[0].key.length;
            for (var col = 0; col < columns; col++) {
                response.write("<th>Key" + col + "</th>");
            }
            response.write("<th>Value</th>");
            response.write("</tr>");
            // Rows

            result.forEach(function (key, value) {
                for (var col = 0; col < key.length; col++) {
                    response.write("<td>" + key[col] + "</td>");
                }
                response.write('<td>' + value + '</td>');
                response.write("</tr>");
            })

            response.write("</table>");
        }

    }
}

class ArrayResult extends Result {
    constructor(result) {
        super(result);
    }
    display(response) {
        var result = this.result;

        var obj={};


        var propNames=(typeof result[0]!=='undefined')?Object.getOwnPropertyNames(result[0]):{object:undefined};
        obj.metaData=[];

        // Title
        for(var i=0; i<propNames.length; i++){
          obj.metaData[i]={name: propNames[i]};
        }

        // Rows
        obj.rows=[];

        for(var i=0; i<result.length; i++){
            var arr=[];
            for(var k=0; k<propNames.length; k++){
                const desc = Object.getOwnPropertyDescriptor(result[i], propNames[k]);
                arr[k]=desc.value;
              }
            obj.rows[i]=arr;
        }

        var ora_result=new OracleDBResult(obj);

        ora_result.display(response);
          
    }
}

module.exports = {
    Result,
    OracleDBResult,
    CouchDBResult,
    ArrayResult
}