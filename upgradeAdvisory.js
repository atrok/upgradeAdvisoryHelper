/* Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   webapp.js
 *
 * DESCRIPTION
 *   Shows a web based query using connections from connection pool.
 *
 *   This displays a table of employees in the specified department.
 *
 *   The script creates an HTTP server listening on port 7000 and
 *   accepts a URL parameter for the department ID, for example:
 *   http://localhost:7000/90
 *
 *   Uses Oracle's sample HR schema.  Scripts to create the HR schema
 *   can be found at: https://github.com/oracle/db-sample-schemas
 *
 *****************************************************************************/

var http = require('http');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var httpPort = 7000;
var docProcessing=require('./docProcessing');
const URL=require('url');
var html=require('./html');
const {OracleDBResult,CouchDBResult, DocProcessingResult} = require('./result');

// Main entry point.  Creates a connection pool, on callback creates an
// HTTP server that executes a query based on the URL parameter given.
// The pool values shown are the default values.
function init(response) {   
  var response=response;
  return new Promise((resolve,reject)=>{
    var resolve=resolve;
    var reject=reject;

  oracledb.createPool(
    {
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString
      // Default values shown below
      // externalAuth: false, // whether connections should be established using External Authentication
      // poolMax: 4, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
      // poolMin: 0, // start with no connections; let the pool shrink completely
      // poolIncrement: 1, // only grow the pool by one connection at a time
      // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
      // poolPingInterval: 60, // check aliveness of connection if in the pool for 60 seconds
      // queueRequests: true, // let Node.js queue new getConnection() requests if all pool connections are in use
      // queueTimeout: 60000, // terminate getConnection() calls in the queue longer than 60000 milliseconds
      // poolAlias: 'myalias' // could set an alias to allow access to the pool via a name
      // stmtCacheSize: 30 // number of statements that are cached in the statement cache of each connection
    },
    function(err, pool) {
      if (err) {
        response.write("createPool() error: " + err.message);
        reject(new Error(err));
        return;
      }

      var resolve=resolve;
      var reject=reject;
      
      handleRequest(response, pool);

      
      }
  );
 })
}

function handleRequest(response, pool) {

  /*
  html.htmlHeader(
    response,
    "Genesys Upgrade Advisory template tool",
    "Example using node.js to create docx files based on predefined docx template file"
  );

  
  if (deptid != parseInt(deptid)) {
    handleError(
      response,
      'URL path "' + deptid + '" is not an integer.  Try http://localhost:' + httpPort + '/30',
      null
    );

    return;
  }
*/

// Checkout a connection from the pool
  pool.getConnection(function(err, connection) {

    if (err) {
      html.handleError(response, "getConnection() error", err);
      //reject(new Error(err));
      return;
    }

    // console.log("Connections open: " + pool.connectionsOpen);
    // console.log("Connections in use: " + pool.connectionsInUse);

    connection.execute(
        'SELECT * FROM view_app_versions',
      //[deptid], // bind variable value
      async function(err, result, resolve,reject) {
        if (err) {
          connection.close(function(err) {
            if (err) {
              // Just logging because handleError call below will have already
              // ended the response.
              console.error("execute() error release() error", err);
            }
          });
          html.handleError(response, "execute() error", err);
          reject(new Error(err));
          return;
        }
        
        //var ora_result=new OracleDBResult(result);

        //html.displayTableResults(response, ora_result);

        var res=await generateDocx(response,result,'false');
        
        html.displayResults(response, res, null);

        /* Release the connection back to the connection pool */
        connection.close(function(err, resolve, res) {
          if (err) {
            html.handleError(response, "normal release() error", err);
          } else {
            html.htmlFooter(response);
          }
          
          //resolve(res);
        });

      }
    );
  });
}




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
function fill_data(obj,struct){
    //console.log(typeof obj);

    const propNames = Object.getOwnPropertyNames(struct);
    propNames.forEach(function(name) {
      const desc = Object.getOwnPropertyDescriptor(struct, name);
      Object.defineProperty(obj, name, desc);
    });
    return obj;
  };
process
  .on('SIGTERM', function() {
    console.log("\nTerminating");
    process.exit(0);
  })
  .on('SIGINT', function() {
    console.log("\nTerminating");
    process.exit(0);
  });

exports.init=init;