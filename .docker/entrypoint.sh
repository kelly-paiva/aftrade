cd server
echo "Iniciando Servidor API - PORTA: $PORT"
./compile.sh && ./run.sh &

cd ../frontend
echo "Iniciando Servidor Frontend - PORTA: $FRONTEND_PORT"
./run.sh
