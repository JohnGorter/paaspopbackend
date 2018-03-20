import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

class PI {
  String clientid;
  String type;
  String url;
  var payload;
  PI(this.clientid, this.type, {this.url});
  Map toJson(){
    Map map = new Map(); 
    map["clientid"] = clientid;
    map["type"] = type;
    map["url"] = url;
    map["payload"] = payload;
    return map;
  }
  String toString() => JSON.encode(this);
}

main (List<String> arguments) async {

  PI p = arguments.length > 2 ? new PI(arguments[0], arguments[1], url:arguments[2]) :  new PI(arguments[0], arguments[1]);
  p.payload = {"test":"t"};
  print("starting pi");
  new Timer.periodic(new Duration(seconds:3), (Timer t){
    print("posting data");
    http.post("http://localhost:1337/data", body: JSON.encode(p), headers: {"Content-Type":"application/json"});
  });
}
