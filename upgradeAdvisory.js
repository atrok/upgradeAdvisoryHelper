var docProcessing = require('./docProcessing');

// Generate DOCX file for resultset

function generateDocx(response, result, recreateViews) {

  return new Promise(async (resolve, reject) => {
    var obj = [];
    // Rows
    try {
      for (var row = 0; row < result.rows.length; row++) {
        obj[row] = {};
        for (col = 0; col < result.rows[row].length; col++) {
          var t = { [result.metaData[col].name]: result.rows[row][col] };
          obj[row] = fill_data(obj[row], t);
        }
      }
      var res = await docProcessing.start(response, obj, recreateViews);
      //response.write("<h1>obj</h1>");

      resolve(res);
    } catch (err) {
      console.log(err.stack);
      reject(err);

    }
  });
}

/*
 Function to create object by copying properties of another object 
*/
function fill_data(obj, struct) {
  //console.log(typeof obj);

  const propNames = Object.getOwnPropertyNames(struct);
  propNames.forEach(function (name) {
    const desc = Object.getOwnPropertyDescriptor(struct, name);
    Object.defineProperty(obj, name, desc);
  });
  return obj;
};
process
  .on('SIGTERM', function () {
    console.log("\nTerminating");
    process.exit(0);
  })
  .on('SIGINT', function () {
    console.log("\nTerminating");
    process.exit(0);
  });

exports.generateDocx = generateDocx;