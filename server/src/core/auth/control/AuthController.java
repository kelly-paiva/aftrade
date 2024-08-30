package aftrade.server.core.auth;

import java.util.*;
import aftrade.server.core.model.*;

public class AuthController {
  public String authenticate(String name, String pass){
    User userModel = new User();
    userModel = userModel.read(name);
    if(userModel != null && userModel.getPass().equals(pass)){
      return "123abc";
    } else return "";
  }
  public boolean validateToken(String token){
    return token.equals("123abc");
  };
}
