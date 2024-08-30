package aftrade.server;

import java.util.*;
import org.json.JSONObject;

import aftrade.server.http.*;
import aftrade.server.storage.*;
import aftrade.server.core.common.*;
import aftrade.server.core.model.*;
import aftrade.server.core.coupon.*;
import aftrade.server.core.auth.*;
import aftrade.server.core.items.*;
import aftrade.server.core.admin.*;
import aftrade.util.Util;

public class App {

    private CouponController couponControl;
    private AuthController authControl;
    private AdminController adminControl;
    private ItemsController itemsControl;

    public App(){
      this.couponControl = new CouponController();
      this.authControl = new AuthController();
      this.adminControl = new AdminController();
      this.itemsControl = new ItemsController();
    }

    public static void main(String[] args) throws Exception {
      App app = new App();
      JSONStorage jsonStorage = JSONStorage.getInstance();
      jsonStorage.readFromFile("./");

      List<Route> arrRoutes = new ArrayList<Route>();

      arrRoutes.add(new Route("/user", new Route.Callback(){
        @Override
        public Response call(String[] args, String body, String method){
          try {
            switch (method) {
              case "GET":
                Map<String, Map<String, String>> userData = app.adminControl.loadUserData();
                return new Response(Server.SUCCESS_CODE, new JSONObject(userData));
              case "POST":
                Map<String, String> insertMapObj = Util.jsonToMapString(new JSONObject(body));
                String insertedMsg = app.adminControl.insertUserData(insertMapObj);
                return new Response(Server.SUCCESS_CODE, new JSONObject("{\"id\": \""+insertedMsg+"\"}"));
              case "DELETE":
                String deletedIds = app.adminControl.deleteUserData(args);
                return new Response(Server.SUCCESS_CODE, new JSONObject("{\"ids\": \""+deletedIds+"\", \"code\":\"SUCCESS\"}"));
              default:
                return new Response(Server.SUCCESS_CODE, new JSONObject("{\"msg\":\"Metodo não implementado\"}"));
            }
          } catch (Exception e) {
            return new Response(Server.INTERNAL_ERROR, new JSONObject("{\"error\":\"Erro ao manipular usuario\", \"msg\":\""+e.getMessage()+"\"}"));
          }
        }

        @Override
        public boolean validateToken(String[] token){
          return app.authControl.validateToken(token[0]);
        }
      }));

      arrRoutes.add(new Route("/items", new Route.Callback(){
        @Override
        public Response call(String[] args, String body, String method){
          try {
            switch (method) {
              case "GET":
                Map<String, Map<String, String>> itemsData = app.itemsControl.loadData();
                return new Response(Server.SUCCESS_CODE, new JSONObject(itemsData));
              case "POST":
                Map<String, String> insertMapObj = Util.jsonToMapString(new JSONObject(body));
                String insertedMsg = app.itemsControl.insertData(insertMapObj);
                return new Response(Server.SUCCESS_CODE, new JSONObject("{\"id\": \""+insertedMsg+"\", \"code\":\"SUCCESS\"}"));
              case "DELETE":
                String deletedIds = app.itemsControl.deleteData(args);
                return new Response(Server.SUCCESS_CODE, new JSONObject("{\"ids\": \""+deletedIds+"\", \"code\":\"SUCCESS\"}"));
              default:
                return new Response(Server.SUCCESS_CODE, new JSONObject("{\"msg\":\"Metodo não implementado\"}"));
            }
          } catch (Exception e) {
            return new Response(Server.INTERNAL_ERROR, new JSONObject("{\"error\":\""+e.getMessage()+"\"}"));
          }
        }

        @Override
        public boolean validateToken(String[] token){
          return app.authControl.validateToken(token[0]);
        }
      }));

      arrRoutes.add(new Route("/coupon", new Route.Callback(){
        @Override
        public Response call(String[] args, String body, String method){
          try {
            switch (method) {
              case "GET":
                Map<String, Map<String, String>> couponData;
                if(args.length>1 && args[0].equals("customerId")){
                  couponData = app.couponControl.searchByCustomer(args[1]);
                } else {
                  couponData = app.couponControl.loadData();
                }
                return new Response(Server.SUCCESS_CODE, new JSONObject(couponData));
              case "POST":
                Map<String, String> insertMapObj = Util.jsonToMapString(new JSONObject(body));
                String insertedMsg = app.couponControl.insertData(insertMapObj);
                return new Response(Server.SUCCESS_CODE, new JSONObject("{\"id\": \""+insertedMsg+"\"}"));
              case "DELETE":
                String deletedIds = app.couponControl.deleteData(args);
                return new Response(Server.SUCCESS_CODE, new JSONObject("{\"ids\": \""+deletedIds+"\", \"code\":\"SUCCESS\"}"));
              default:
                return new Response(Server.SUCCESS_CODE, new JSONObject("{\"msg\":\"Metodo não implementado\"}"));
            }
          } catch (Exception e) {
            return new Response(Server.INTERNAL_ERROR, new JSONObject("{\"error\":\""+e.getMessage()+"\"}"));
          }
        }

        @Override
        public boolean validateToken(String[] token){
          return app.authControl.validateToken(token[0]);
        }
      }));

      arrRoutes.add(new Route("/save", new Route.Callback(){
        @Override
        public Response call(String[] args, String body, String method){
          try {
            jsonStorage.writeToFile("./");
            return new Response(Server.SUCCESS_CODE, new JSONObject("{\"msg\":\"Dados salvos no arquivo\"}"));
          } catch (Exception e) {
            return new Response(Server.INTERNAL_ERROR, new JSONObject("{\"error\":\"Erro ao manipular arquivo\", \"msg\":\""+e.getMessage()+"\"}"));
          }
        }

        @Override
        public boolean validateToken(String[] token){
          return app.authControl.validateToken(token[0]);
        }
      }));


      arrRoutes.add(new Route("/auth", new Route.Callback(){
        @Override
        public Response call(String[] args, String body, String method){
          try {
            JSONObject jsonBody = new JSONObject(body);
            String username = (jsonBody.get("user").toString());
            String password = (jsonBody.get("pass").toString());
            
            String token = app.authControl.authenticate(username, password);
            
            if(token.length()>1){
              return new Response(Server.SUCCESS_CODE, new JSONObject("{\"token\":\""+token+"\"}"));
            } else return new Response(Server.UNAUTHORIZED_CODE, new JSONObject("{\"msg\":\"Usuario ou Senha Invalido\"}"));
          } catch (Exception e) {
            return new Response(Server.INTERNAL_ERROR, new JSONObject("{\"error\":\"Erro ao manipular usuario\", \"msg\":\""+e.getMessage()+"\"}"));
          }
        }

        @Override
        public boolean validateToken(String[] token){
          return true;
        }
      }));

      Route[] routes = new Route[arrRoutes.size()];
      routes = arrRoutes.toArray(routes);
      Server server = new Server(routes);
    }
}
