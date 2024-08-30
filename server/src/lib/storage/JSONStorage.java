package aftrade.server.storage;
import org.json.JSONObject;
import java.io.*;

import aftrade.server.storage.FileStorage;

public class JSONStorage extends Storage<JSONObject>{
  public static JSONStorage instance;

  private JSONObject storage; 
  private JSONStorage(){
    this.storage = new JSONObject();
  }

  public static JSONStorage getInstance() {
    if (instance == null) {
      instance = new JSONStorage();
    }
    return instance;
  }

  @Override
  public boolean saveTo(String key, JSONObject data){
    return false;
  };

  @Override
  public boolean saveTo(String key, JSONObject data, String path){
    JSONObject storage = this.storage.getJSONObject(path);
    storage.put(key, data);
    this.storage.put(path, storage);
    return false;
  };

  @Override
  public JSONObject readFrom(String key, String path) throws IOException{
    JSONObject storage = this.storage.getJSONObject(path);
    return storage.getJSONObject(key);
  };

  public JSONObject readAll(String path) throws IOException {
    return this.storage.getJSONObject(path);
  }

  public JSONObject deleteFrom(String key, String path) throws IOException{
    JSONObject storage = this.storage.getJSONObject(path);
    return new JSONObject(storage.remove(key));
  };

  public boolean setStorage(JSONObject storage){
    this.storage = storage;
    return true;
  }

  public void initStorage(String name){
    System.out.println("Iniciando storage "+name);
    if(!this.storage.has(name)) this.storage.put(name, new JSONObject());
    else System.out.println("Storage "+name+" já iniciada");
  }

  public void readFromFile(String path) throws IOException{
    String fileName = path+".aftrade-storage.json";
    System.out.println("Carregando arquivo de storage "+fileName);
    FileStorage fs = new FileStorage();
    String fileContent = fs.readFrom(fileName, "");
    this.setStorage(new JSONObject(fileContent));
  }

  public void writeToFile(String path) throws IOException{
    FileStorage fs = new FileStorage();
    fs.saveTo(path+".aftrade-storage.json", this.storage.toString());
  }
}

