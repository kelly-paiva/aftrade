package aftrade.server.storage;

import java.io.*;

public class FileStorage extends Storage<String> {
  @Override
  public boolean saveTo(String key, String data){
    try {
      this.writeToFile(key, data);
    } catch (IOException e) {
      System.out.println("Erro ao inserir arquivo.");
      System.out.println(e.getMessage());
    }
    return true;
  };

  @Override
  public boolean saveTo(String key, String data, String path){
    try {
      this.writeToFile(path+key, data);
    } catch (IOException e) {
      System.out.println("Erro ao inserir arquivo.");
      System.out.println(e.getMessage());
    }
    return true;
  };

  public boolean appendTo(String key, String data){
    try {
      this.appendToFile(key, data);
    } catch (IOException e) {
      System.out.println("Erro ao inserir arquivo.");
      System.out.println(e.getMessage());
    }
    return true;
  };

  @Override
  public String readFrom(String key, String path) throws IOException {
    String file = "";

    BufferedReader reader = new BufferedReader(new FileReader(key));

    String currentLine = reader.readLine();
    while (currentLine != null) {
      file = file.concat("\n"+currentLine);
      currentLine = reader.readLine();
    }

    reader.close();

    return file;
  };

  private void writeToFile(String fileName, String data) throws IOException {
      BufferedWriter writer = new BufferedWriter(new FileWriter(fileName));
      writer.write(data);

      writer.close();
  }

  private void appendToFile(String fileName, String data) throws IOException {
      BufferedWriter writer = new BufferedWriter(new FileWriter(fileName, true));
      writer.append(data);

      writer.close();
  }
}
