curl "http://localhost:3000/staff/beijing/li?aa=1&bb=2"
sleep 1

# 测试json提交
curl -H 'Content-Type: application/json' -X POST -d '{"paris":{"jojo":{"like":"fighting"}}}' "http://localhost:3000/staff" -i 

curl -H 'Content-Type: application/json' -X POST -d '{"beijing":{"zhao":{"like":"listening"},"zhang":{"like":"playing"}}}' "http://localhost:3000/staff" -i 

curl -H 'Content-Type: application/json' -X POST -d '{"beijing":{"zhao":{"like":"listening"}},"guangzhou":{"liu":{"like":"sleeping"}}}' "http://localhost:3000/staff" -i 
sleep 1

# 测试表单提交
curl -d 'staff[0][city]=beijing&staff[0][name]=lili&staff[0][like]=eating&staff[0][like]=reading' "http://localhost:3000/staff2" -i 

# 测试表单提交
curl -d 'beijing={"zhao":{"like":"listening"}}' "http://localhost:3000/staff3" -i

curl -d 'beijing={"zhao":{"like":"listening"}}&shanghai={"zhao":{"like":"eating"}}' "http://localhost:3000/staff3" -i

curl -d '{"beijing":{"zhao":{"like":"listening"}}}' "http://localhost:3000/staff2" -i 