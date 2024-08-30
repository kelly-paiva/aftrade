package aftrade.server.http;

import org.json.JSONObject;

public class Response {
  private int code;
  private JSONObject body = null;

  public Response(int code, JSONObject body){
    this.code = code;
    this.body = body;
  }

  public Response(int code, String body){
    this.code = code;
  }

  public int getCode(){
    return this.code;
  }

  public void setCode(int code){
    this.code = code;
  }

  public JSONObject getBody(){
    return this.body;
  }

  public void setBody(JSONObject body){
    this.body = body;
  }
}
