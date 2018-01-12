// Report an error
function handleError(response, text, err) {
  if (err) {
    text += ": " + err.message;
  }
  console.error(text);
  response.write("<p>Error: " + text + "</p>");
  htmlFooter(response);
}

// Display query results
function displayTableResults(response, result) {
  response.write("<h2>Query results</h2>");

  result.display(response);
}

// Display query results
function displayResults(response, result) {
  response.write("<div>")
  response.write(result);
  response.write("</div>");
}
// Prepare HTML header
function htmlHeader(response, title, caption) {
  response.writeHead(200, { "Content-Type": "text/html" });
  response.write("<!DOCTYPE html>");
  response.write("<html>");
  response.write("<head>");
  response.write("<style>" +
    "body {background:#FFFFFF;color:#000000;font-family:Arial,sans-serif;margin:40px;padding:10px;font-size:12px;}" +
    "h1 {margin:0px;margin-bottom:12px;background:#FF0000;text-align:center;color:#FFFFFF;font-size:28px;}" +
    "table {border-collapse: collapse;   margin-left:auto; margin-right:auto;}" +
    "td, th {padding:8px;border-style:solid}" +
    "</style>\n");
  response.write("<title>" + caption + "</title>");
  response.write("</head>");
  response.write("<body>");
  response.write("<h1>" + title + "</h1>");
}

// Prepare HTML footer
function htmlFooter(response) {
  response.write("<p>Finished</p></body></html>");
  response.end();
}

function htmlMenu(response) {
  response.write('<div class=\'menu\'>' +
    '<p><a title="Home" href="/">Home</a></p>'+  
    '<p><a title="Start Upgrade Advisory document preparation" href="/prepareAdvisory">Start Upgrade Advisory document creation</a></p>' +
    '<p><a title="Test Upgrade Advisory document preparation" href="/testPrepareAdvisory">Test Upgrade Advisory document creation</a></br>'+
    'use ?apptype=<your apptype>&release=<your release> as a query to generate report for single component only</p>'+
    '<p><a title="Recreate Couch DB views" href="/recreateViews">Recreate Couch DB views</a></p>' +
    '<p><a title="Get list of available components" href="/getComponents">Get list of available components</a></p>' +
    '</div>');
}

module.exports = {
  htmlHeader,
  htmlFooter,
  displayResults,
  handleError,
  displayTableResults,
  htmlMenu
}