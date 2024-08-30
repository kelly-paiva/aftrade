package aftrade.server.http;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import aftrade.server.http.Route;
import aftrade.server.http.Route.Callback;
import aftrade.server.http.Response;
import aftrade.util.Util;

import org.json.JSONObject;
import java.util.List;
import java.util.Base64;

public class Server {
    private HttpServer server;
    private Route[] routes;

    static int PORT=Integer.valueOf(System.getenv("PORT"));
    public static int SUCCESS_CODE=200;
    public static int UNAUTHORIZED_CODE=401;
    public static int INTERNAL_ERROR=500;

    public Server(Route[] routes) throws Exception {
        this.routes = routes;
        this.server = HttpServer.create(new InetSocketAddress(Server.PORT), 0);
        this.setupRouteHandlers();
        this.server.setExecutor(null);
        this.server.start();
        System.out.println("Servidor iniciado rodando na porta: "+Server.PORT);
    }

    private void setupRouteHandlers(){
      for(Route route: this.routes){
        System.out.println("Iniciando rota: "+route.path);
        this.server.createContext(route.path, new RouteHandler(route.handler));
      }
    }

    class RouteHandler implements HttpHandler {
        private Callback callback;
        public RouteHandler (Callback callback){
          this.callback = callback;
        }

        @Override
        public void handle(HttpExchange t) throws IOException {
            Response response;
          try{
            String method = t.getRequestMethod();
            String uri = t.getRequestURI().toString();

            System.out.println(method+" "+uri);
            String[] args = this.getRequestParams(uri);

            String bodyString = Util.inputStreamToString(t.getRequestBody());

            if(method.equals("OPTIONS")) response = new Response(Server.SUCCESS_CODE, new JSONObject("{\"opt\":\"aftrade\"}")); 
            else if(this.callback.validateToken(this.getAuthCredentials(t))) response = this.callback.call(args, bodyString, method);
            else response = new Response(Server.UNAUTHORIZED_CODE, new JSONObject("{\"error\":\"Not authorized\"}"));
          } catch(Exception e) {
            System.out.println(e.getMessage());
            response = new Response(Server.INTERNAL_ERROR, new JSONObject("{\"error\":\"Internal Server Error\"}"));
          }

          String responseString = response.getBody().toString();
          t.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
          t.getResponseHeaders().set("Access-Control-Allow-Headers", "authorization");
          t.getResponseHeaders().set("Access-Control-Allow-Methods", "POST,PUT,OPTIONS,DELETE,GET");
          t.sendResponseHeaders(response.getCode(), responseString.length());
          OutputStream os = t.getResponseBody();
          os.write(responseString.getBytes());
          os.close();
        }

        private String[] getRequestParams(String uri){
          String[] NO_FILES = {};
          try {
            String[] uriWParams = uri.split("\\?");

            if(uriWParams.length <= 1){
              return NO_FILES;
            }

            String[] paramsString;
            if(uriWParams[1].contains("&")){
              paramsString = uriWParams[1].split("&");
            } else {
              paramsString = new String[1];
              paramsString[0] = uriWParams[1];
            }

            String[] retArray = new String[paramsString.length*2];
            for (int i = 0; i < paramsString.length; i++) {
              retArray[i*2] = paramsString[i].split("=")[0];
              retArray[(i*2)+1] = paramsString[i].split("=")[1];
            }

            return retArray;
          } catch (Exception e) {
            System.out.println("Erro ao tratar params");
            System.out.println(e.getMessage());
            return NO_FILES;
          }
        }

        private String[] getAuthCredentials(HttpExchange t) throws Exception{
          try {
            List<String> auth = t.getRequestHeaders().get("Authorization");
            String decoded = new String(Base64.getDecoder().decode(auth.get(0)), "UTF-8");

            return new String[]{ decoded };
          } catch (Exception e) {
            throw new Exception("Erro ao decodificar base64. "+e.getMessage());
          }

        }
    }
}
