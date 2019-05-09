. .env
URL=$LAMBDA_URL
(echo -n '{"image": "'; base64 ./test/cat.jpg; echo '"}') | curl -H "Content-Type: application/json" -d @-  $URL