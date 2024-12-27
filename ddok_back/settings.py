from pathlib import Path  # 추가
import os
import json
from datetime import timedelta
from django.core.exceptions import ImproperlyConfigured
from google.oauth2 import service_account  # 추가

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

#---------------------------------------------------
# Google Cloud 자격 증명 파일 경로
GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
if not GOOGLE_APPLICATION_CREDENTIALS:
    raise ImproperlyConfigured("GOOGLE_APPLICATION_CREDENTIALS environment variable not set")



# Load the credentials from the file
GS_CREDENTIALS = service_account.Credentials.from_service_account_file(GOOGLE_APPLICATION_CREDENTIALS)
#--------------------------------------------------- 배포 환경에서 필요 없음


CSRF_TRUSTED_ORIGINS = [
    'https://django-app-1093993747989.asia-northeast3.run.app' #로그인 토큰을 위한 출처 신뢰 설정
]
ALLOWED_HOSTS = [
    'django-app-1093993747989.asia-northeast3.run.app'
]
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # 프론트엔드 주소
]

# SECRET_KEY 설정
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
if not SECRET_KEY:
    raise ImproperlyConfigured("Set the DJANGO_SECRET_KEY environment variable")


# OPENAI_API_KEY 설정
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise ImproperlyConfigured("Set the OPENAI_API_KEY environment variable")


# Quick-start development settings - unsuitable for production
#DEBUG = True 배포환경에선 False, 로컬에서 True
DEBUG = True

ALLOWED_HOSTS = ['*'] # 모든 도메인 허용


CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'QuestionList',
    'corsheaders',
    'Users',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'InterviewAnalyze',
    'myLog',
    'Eyetrack',
    'storages',
    'poseAnalyze',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=3),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

ROOT_URLCONF = 'ddok_back.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ddok_back.wsgi.application'

DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.sqlite3',
       'NAME': BASE_DIR / 'db.sqlite3',
   }
} # sqlite 데이터베이스 연결

# DATABASES = { # cloud run 때문에 구글 SQL 사용
#     'default': {
#         #'ENGINE': 'django.db.backends.postgresql_psycopg2',
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'postgres',  # Cloud SQL의 데이터베이스 이름
#         'USER': 'postgres',  # Cloud SQL에서 생성한 사용자 이름
#         'PASSWORD': '000999',  # Cloud SQL 비밀번호
#         'HOST': '/cloudsql/ppopap:asia-northeast3:ppopapsql',  # Cloud SQL 인스턴스의 연결 이름 / 배포용
#         #'HOST': '127.0.0.1', # 로컬용~
#         'PORT': '5432',  # PostgreSQL 기본 포트
#     }
# }


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# 브라우저에서 미디어 파일에 접근할 때 사용할 URL 경로
MEDIA_URL = '/media/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'Users.User'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'debug.log'),
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],  # 콘솔 핸들러 추가
            'level': 'INFO',
            'propagate': True,
        },
        'ddok_back': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}



# GS_BUCKET_NAME = 'ppopapbk'
# DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
# STATICFILES_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
#MEDIA_URL = f'https://storage.googleapis.com/{GS_BUCKET_NAME}/videos/'

# 로컬
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
DATA_UPLOAD_MAX_MEMORY_SIZE = 524288000  # m

MEDIA_URL = '/media/'  # URL 경로
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # 파일 저장 경로


STATIC_URL = 'static/' 

# STATIC_URL = f'https://storage.googleapis.com/{GS_BUCKET_NAME}/static/' #cloud run 하면서 추가
# MEDIA_URL = f'https://storage.googleapis.com/{GS_BUCKET_NAME}/media/' #cloud run 하면서 추가

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') #cloud run에선 안 씀

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_TASK_SERIALIZER = 'json'