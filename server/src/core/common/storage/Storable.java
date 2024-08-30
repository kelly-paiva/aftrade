package aftrade.server.core.common;

import java.util.*;
import java.util.stream.Collectors;
import org.json.JSONObject;

import aftrade.server.storage.JSONStorage;
import aftrade.server.core.common.*;
import aftrade.util.Util;

public class Storable implements IStorable<Storable> {
  private String storageName;
  private JSONStorage jsonStorage = JSONStorage.getInstance();
  private String keyName;

  protected Map<String, String> data;

  public Storable(String storageName, String keyName){
    this.storageName = storageName;
    this.keyName = keyName;
    this.data = new HashMap<String, String>();
    this.jsonStorage.initStorage(this.storageName);
  }

  protected void setData(Map<String, String> data){
    this.data = data;
  }

  public boolean save(){
    try {
      this.jsonStorage.saveTo(this.data.get(this.keyName), new JSONObject(this.data), this.storageName);
      return true;
    } catch (Exception e) {
      System.out.println("Erro ao salvar registro. "+e.getMessage());
      return false;
    }
  }

  public Storable read(String key){
    try {
      Map<String, Object> objectMap = this.jsonStorage.readFrom(key, this.storageName).toMap();
      Map<String, String> stringMap = objectMap.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> (String)e.getValue()));
      this.setData(stringMap);
      return this;
    } catch (Exception e) {
      System.out.println("Erro ao ler registro. "+e.getMessage());
      return null;
    }
  }

  @SuppressWarnings("unchecked")
  public  Map<String, Map<String, String>> readAll(){
    try {
      Map<String, Object> objectMap = this.jsonStorage.readAll(this.storageName).toMap();
      Map<String, Map<String, String>> data = new HashMap<String, Map<String, String>>();

      for (Map.Entry<String, Object> entry : objectMap.entrySet()) {
        Map<String, Object> entryMap = new HashMap((Map)entry.getValue());
        Map<String, String> stringMap = entryMap.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> (String)e.getValue()));
        data.put(String.valueOf(entry.getKey()), stringMap);
      }

      System.out.println(data.toString());
      return data;
    } catch (Exception e) {
      System.out.println("Erro ao ler registro. "+e.getMessage());
      return null;
    }

  }
  
  public boolean delete(String key){
    try {
      this.jsonStorage.deleteFrom(key, this.storageName);
      return true;
    } catch (Exception e) {
      System.out.println("Erro ao apagar registro. "+e.getMessage());
      return false;
    }
  }

  public String toString(){
    StringBuilder mapAsString = new StringBuilder("{");
    for (String key : this.data.keySet()) {
      mapAsString.append(key + "=" + this.data.get(key) + ", ");
    }
    mapAsString.delete(mapAsString.length()-2, mapAsString.length()).append("}");
    return mapAsString.toString();
  }
}
