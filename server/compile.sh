echo -e "Compilando \n"
if [[ ! -d ./build/ ]]; then
  mkdir build
fi

javac \
  -cp jar/* \
  -Xlint:unchecked \
  -d build $(find src -name "*.java")
