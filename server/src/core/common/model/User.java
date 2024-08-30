package aftrade.server.core.model;

import aftrade.server.core.common.*;

import java.util.HashMap;
import java.util.Map;

public class User extends Storable {
  private static int id = -1;
  private String _id = "";

  public User(){
    super("user", "login");
  }

  public User(String user,  String name, String pass, String type, String state, boolean autosave){
    super("user", "login");

    if(User.id<0){
      User.id = this.readAll().size();
    }

    User.id++;
    this._id = user;
    this.data = new HashMap<String, String>();
    this.data.put("id", String.valueOf(this._id));

    this.data.put("login", user);
    this.data.put("nome", name);
    this.data.put("pass", pass);
    this.data.put("tipo", type);
    this.data.put("situacao", state);
    if(autosave) this.save();
  }

  public String setId(String id){
    this._id = id;
    this.data.put("login", String.valueOf(this._id));
    return this._id;
  }

  public String getId(){
    return this._id;
  }

  public String getPass(){
    return this.data.get("pass");
  }

  @Override
  public User read(String key){
    return (User)super.read(key);
  }
}
