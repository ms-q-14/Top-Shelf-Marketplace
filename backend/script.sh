#!/bin/bash

# Start all of the servers
npm run --prefix cart-service devStart &
npm run --prefix identity-service devStart &
npm run --prefix product-service devStart &
npm run --prefix express-gateway start &
# Wait for all of the servers to finish starting up
wait

echo "All servers started!"