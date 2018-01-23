curl "http://localhost:3000/staff/beijing/li?aa=1&bb=2"
sleep 1
curl -H 'Content-Type: application/json' -X POST -d '{"beijing":{"zhao":{"like":"listening"}}}' "http://localhost:3000/staff" -i 

curl -H 'Content-Type: application/json' -X POST -d '{"beijing":{"zhao":{"like":"listening"},"zhang":{"like":"playing"}}}' "http://localhost:3000/staff" -i 

curl -H 'Content-Type: application/json' -X POST -d '{"guangzhou":{"liu":{"like":"sleeping"},"han":{"like":"dreaming"}}}' "http://localhost:3000/staff" -i 
sleep 1
