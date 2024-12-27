# 베이스 이미지로 Python 사용
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필수 패키지 설치 (CMake, GCC, Make)
RUN apt-get update && apt-get install -y \
    cmake \
    g++ \
    make \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgtk2.0-dev \
    libpq-dev \
    gcc \
    python3-dev \
    libboost-all-dev
    
# ffmpeg 설치
RUN apt-get update && apt-get install -y ffmpeg


# 최신 pip, setuptools, wheel 설치
RUN python -m pip install --upgrade pip setuptools wheel

# requirements.txt 복사 및 종속성 설치
COPY requirements.txt .
RUN pip install -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# 로컬에서 서비스 계정 JSON 파일을 Docker 컨테이너로 복사
COPY openapi.json /app/openapi.json
COPY sttapi.json /app/sttapi.json
COPY secrets.json /app/secrets.json

# 환경 변수 설정
ENV GOOGLE_APPLICATION_CREDENTIALS="/app/sttapi.json"
ENV SECRETS_CREDENTIALS="/app/secrets.json"
ENV OPENAI_API_KEY="sk-proj-aNvPiSwkglWXQpVlzjXdT3BlbkFJWjnmOpeDYuYlzrbG3wuC"
ENV DJANGO_SECRET_KEY="django-insecure-z@6qfa%=dz95je8!c!3oa*=5po=#s)@az6+o%&1i4vgcs)3+(q"
ENV OPENAPI_CREDENTIALS="/app/openapi.json"

# Entrypoint.sh 복사
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh


# static 파일 수집
RUN python manage.py collectstatic --noinput

# 포트 설정
EXPOSE 8080

# 서버 실행

#CMD ["gunicorn", "ddok_back.wsgi:application", "--bind", "0.0.0.0:8080"]

# Entrypoint 설정
ENTRYPOINT ["/app/entrypoint.sh"]
