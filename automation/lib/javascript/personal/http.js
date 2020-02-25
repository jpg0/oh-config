
const FileUtils = Java.type('org.apache.commons.io.FileUtils');

exports.download = function (url, filepath) {
    var url = new java.net.URL(url);
    return FileUtils.copyURLToFile(url, new java.io.File(filepath));
}

exports.get2 = function (theUrl) {
    var con = new java.net.URL(theUrl).openConnection();
    con.requestMethod = "GET";

    return asResponse(con);
};

exports.post2 = function (theUrl, data, contentType) {
    contentType = contentType || "application/json";
    var con = new java.net.URL(theUrl).openConnection();

    con.requestMethod = "POST";
    con.setRequestProperty("Content-Type", contentType);

    // Send post request
    con.doOutput = true;
    write(con.outputStream, data);

    return asResponse(con);
};

var asResponse = function (con) {
    var d = read(con.inputStream);

    return { data: d, statusCode: con.responseCode };
}

var write = function (outputStream, data) {
    var wr = new java.io.DataOutputStream(outputStream);
    wr.writeBytes(data);
    wr.flush();
    wr.close();
}

var read = function (inputStream) {
    var inReader = new java.io.BufferedReader(new java.io.InputStreamReader(inputStream));
    var inputLine;
    var response = new java.lang.StringBuffer();

    while ((inputLine = inReader.readLine()) != null) {
        response.append(inputLine);
    }
    inReader.close();
    return response.toString();
}
