from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import logging
from django.conf import settings

from rest_framework.response import Response
from rest_framework import status
import requests


logger = logging.getLogger(__name__)


# 서명된 URL을 요청하는 뷰
class TestView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, *args, **kwargs):
    #def get(self, request, format=None):
        print("aaa")
        return  Response({"dd": request.data.get('aa','')}, status=status.HTTP_200_OK)
    
    
# INFO 2024-09-13 23:41:12,450 basehttp "POST /interview_questions/ HTTP/1.1" 201 876

# INFO 2024-09-13 23:43:13,521 basehttp "OPTIONS /interview/voice/2/26/?action=upload HTTP/1.1" 200 0
# INFO 2024-09-13 23:43:13,522 basehttp "OPTIONS /interview/responses/2/26/ HTTP/1.1" 200 0
# 111111
# 333333
# 333333
# 333333
# 222
# ERROR 2024-09-13 23:43:13,533 log Internal Server Error: /interview/responses/2/26/
# Traceback (most recent call last):
#   File "C:\Users\iseo\Desktop\Backend-main_0910\myvenv\lib\site-packages\django\core\handlers\exception.py", line 55, in inner
#     response = get_response(request)
#   File "C:\Users\iseo\Desktop\Backend-main_0910\myvenv\lib\site-packages\django\core\handlers\base.py", line 197, in _get_response
#     response = wrapped_callback(request, *callback_args, **callback_kwargs)
#   File "C:\Users\iseo\Desktop\Backend-main_0910\myvenv\lib\site-packages\django\views\decorators\csrf.py", line 56, in wrapper_view
#     return view_func(*args, **kwargs)
#   File "C:\Users\iseo\Desktop\Backend-main_0910\myvenv\lib\site-packages\django\views\generic\base.py", line 104, in view
#     return self.dispatch(request, *args, **kwargs)
#   File "C:\Users\iseo\Desktop\Backend-main_0910\myvenv\lib\site-packages\rest_framework\views.py", line 509, in dispatch
#     response = self.handle_exception(exc)
#   File "C:\Users\iseo\Desktop\Backend-main_0910\myvenv\lib\site-packages\rest_framework\views.py", line 469, in handle_exception
#     self.raise_uncaught_exception(exc)
#   File "C:\Users\iseo\Desktop\Backend-main_0910\myvenv\lib\site-packages\rest_framework\views.py", line 480, in raise_uncaught_exception
#     raise exc
#   File "C:\Users\iseo\Desktop\Backend-main_0910\myvenv\lib\site-packages\rest_framework\views.py", line 506, in dispatch
#     response = handler(request, *args, **kwargs)
#   File "C:\Users\iseo\Desktop\Backend-main_0910\InterviewAnalyze\views.py", line 111, in post
#     redundant_expressions = file.read().splitlines()
# UnicodeDecodeError: 'cp949' codec can't decode byte 0xec in position 0: illegal multibyte sequence
# INFO 2024-09-13 23:43:13,540 basehttp "POST /interview/voice/2/26/?action=upload HTTP/1.1" 201 38
# ERROR 2024-09-13 23:43:13,543 basehttp "POST /interview/responses/2/26/ HTTP/1.1" 500 145
# INFO 2024-09-13 23:43:13,545 basehttp "OPTIONS /interview/voice/2/26/?action=merge HTTP/1.1" 200 0
# 000
# WARNING 2024-09-13 23:43:13,552 log Bad Request: /interview/voice/2/26/
# WARNING 2024-09-13 23:43:13,553 basehttp "POST /interview/voice/2/26/?action=merge HTTP/1.1" 400 56
        