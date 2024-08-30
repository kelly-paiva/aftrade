package aftrade.server.http;

import aftrade.server.http.Response;

public class Route {
  public String path = "";

  public Callback handler;

  public Route(String path, Callback handler){
    this.path = path;
    this.handler = handler;
  }

  public interface Callback{
     Response call(String[] args, String body, String method);
     boolean validateToken(String[] token);
  }
}
