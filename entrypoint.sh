#!/bin/bash

# 데이터베이스 마이그레이션
echo "Running database migrations..."
python manage.py migrate --noinput

# collectstatic dockerfile에 이미 있음 
# echo "Collecting static files..."
# python manage.py collectstatic --noinput

# gunicorn 실행
echo "Starting Gunicorn..."
exec gunicorn ddok_back.wsgi:application \
    --bind 0.0.0.0:8080 \
    --workers 3
