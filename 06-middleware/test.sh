curl "http://localhost:3000/a"
sleep 1
curl "http://localhost:3000/b"
sleep 1
curl -H 'Content-Type: application/json' -X POST -d '{"a":{"b":{"c":"d"}}}' "http://localhost:3000/b" -i 
sleep 1
curl "http://localhost:3000/c"
sleep 1
