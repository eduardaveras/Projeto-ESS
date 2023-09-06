#!/bin/bash

if [ "$1" = "backend" ]; then
    cd backend && npm install && cd ..
    echo "ENV=DEV"> ./backend/.env.dev && echo "PORT=5001" >> ./backend/.env.dev
    echo "ENV=TEST" > ./backend/.env.test && echo "PORT=5002" >> ./backend/.env.test
    if [ "$2" = "run" ]; then
        cd backend && env=dev npm run start
    elif [ "$2" = "test" ]; then
        cd backend && env=test npm run test
    fi
elif [ "$1" = "frontend" ]; then
    cd frontend && npm install && cd ..
    echo "ENV=DEV" > ./frontend/.env.dev && echo "PORT=5003" >> ./frontend/.env.dev
    echo "ENV=TEST" > ./frontend/.env.test && echo "PORT=5004" >> ./frontend/.env.test
    if [ "$2" = "run" ]; then
        cd frontend && env=dev npm run start
    elif [ "$2" = "test" ]; then
        cd frontend && env=test npm run test
    fi
fi


