from django.shortcuts import get_object_or_404

from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated

from rest_framework.parsers import JSONParser

from .models import InterviewAnalysis, QuestionLists, VoiceAnalysis

import os

from django.conf import settings

import logging

import requests

from .serializers import *

 

from rest_framework import serializers

 

import uuid

 

# 이서 import 항목

from google.cloud import speech

from google.cloud import storage

from django.http import JsonResponse

from rest_framework.parsers import MultiPartParser, FormParser

from google.cloud.speech import RecognitionConfig, RecognitionAudio

from google.oauth2 import service_account

from django.conf import settings

from pydub import AudioSegment

import nltk

from nltk.tokenize import word_tokenize

import difflib

import parselmouth

import numpy as np

import base64

import io

import re

import matplotlib.pyplot as plt

import matplotlib.font_manager as fm

import nltk

import matplotlib

from pathlib import Path

matplotlib.use('Agg')  # 백엔드를 Agg로 설정

from rest_framework import status

from pydub import AudioSegment

from io import BytesIO

import matplotlib.pyplot as plt

import tempfile

 

from django.shortcuts import get_object_or_404

from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated

from rest_framework.parsers import JSONParser

from .models import InterviewAnalysis, QuestionLists

import os

from django.conf import settings

import logging

import requests

import re

import time

 

from rest_framework import status

from pydub import AudioSegment

from io import BytesIO

import parselmouth

import matplotlib.pyplot as plt

import numpy as np

import base64

import tempfile

import datetime  # 날짜와 시간을 다루기 위해 필요

from google.cloud.exceptions import GoogleCloudError  # Google Cloud에서 발생하는 예외 처리에 필요


 

logger = logging.getLogger(__name__)


 

# 답변 스크립트 분석

from django.shortcuts import get_object_or_404

from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated

from rest_framework.parsers import JSONParser

from .models import InterviewAnalysis, QuestionLists

import os

from django.conf import settings

import logging

import requests

import binascii

from Users.models import User

import sys

 

from collections import Counter

 

logger = logging.getLogger(__name__)

 

class ResponseAPIView(APIView):

    parser_classes = [JSONParser]

    permission_classes = [IsAuthenticated]

 

    def post(self, request, user_id, interview_id):

        print("response api view")

        user = get_object_or_404(User, id=user_id)

        question_list = get_object_or_404(QuestionLists, id=interview_id)

        interview_response = InterviewAnalysis(question_list=question_list)

 

        # 로그인한 사용자를 user 필드에 할당

        interview_response.user = request.user

 

        base_dir = settings.BASE_DIR

        redundant_expressions_path = os.path.join(base_dir, 'InterviewAnalyze', 'redundant_expressions.txt')

        inappropriate_terms_path = os.path.join(base_dir, 'InterviewAnalyze', 'inappropriate_terms.txt')

        print("file name "+redundant_expressions_path)

        try:

            with open(redundant_expressions_path, 'r', encoding='UTF-8') as file:

                redundant_expressions = file.read().splitlines()

               

            with open(inappropriate_terms_path, 'r', encoding='UTF-8') as file:

                inappropriate_terms = dict(line.strip().split(':') for line in file if ':' in line)

        except FileNotFoundError as e:

            logger.error(f"File not found: {e}")

            return Response({"error": "Required file not found"}, status=500)

 

        response_data = []

        all_responses = ""

        for i in range(1, 11):

            script_key = f'script_{i}'

            response_key = f'response_{i}'

            question_key = f'question_{i}'

            script_text = request.data.get(script_key, "")

            question_text = getattr(question_list, question_key, "")

 

            # 잉여 표현과 부적절한 표현을 분석

            found_redundant = self.find_redundant_expressions(script_text, redundant_expressions)

            corrections = {}

            corrected_text = script_text

            for term, replacement in inappropriate_terms.items():

                if term in script_text:

                    corrections[term] = replacement

                    corrected_text = corrected_text.replace(term, replacement)

 

            setattr(interview_response, f'response_{i}', script_text)

            setattr(interview_response, f'redundancies_{i}', ', '.join(found_redundant))

            setattr(interview_response, f'inappropriateness_{i}', ', '.join(corrections.keys()))

            setattr(interview_response, f'corrections_{i}', str(corrections))

            setattr(interview_response, f'corrected_response_{i}', corrected_text)

 

            response_data.append({

                'question': question_text,

                'response': script_text,

                'redundancies': found_redundant,

                'inappropriateness': list(corrections.keys()),

                'corrections': corrections

            })

 

            if script_text:

                all_responses += f"{script_text}\n"

 

        interview_response.save()

 

        prompt = f"다음은 사용자의 면접 응답입니다:\n{all_responses}\n\n응답이 직무연관성, 문제해결력, 의사소통능력, 성장가능성, 인성과 관련하여 적절했는지 300자 내외로 총평을 작성해줘."

        try:

            response = requests.post(

                "https://api.openai.com/v1/chat/completions",

                headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},

                json={"model": "gpt-3.5-turbo-0125", "messages": [{"role": "user", "content": prompt}]},

                timeout=10

            )

            response.raise_for_status()

            gpt_feedback = response.json().get('choices')[0].get('message').get('content')

            interview_response.overall_feedback = gpt_feedback  # 총평을 overall_feedback 필드에 저장

        except requests.exceptions.RequestException as e:

            logger.error(f"GPT API request failed: {e}")

            gpt_feedback = "총평을 가져오는 데 실패했습니다."

            interview_response.overall_feedback = gpt_feedback  # 실패 메시지를 저장

 

        interview_response.save()  # 변경 사항 저장

 

        return Response({

            'interview_id': interview_response.id,

            'responses': response_data,

            'gpt_feedback': gpt_feedback

        }, status=200)

 

    def find_redundant_expressions(self, script_text, redundant_expressions):

        # 스크립트를 공백을 기준으로 단어 단위로 분할

        words = script_text.split()

        redundancies = [word for word in words if word in redundant_expressions]

        return redundancies


 

# 이서 mp3 받아오기 위한 스토리지 관련 설정

    # def generate_signed_url(bucket_name, blob_name, expiration=86400):

    #     client = storage.Client()

    #     try:

    #         bucket = client.bucket(bucket_name)

    #         blob = bucket.blob(blob_name)

    #         url = blob.generate_signed_url(

    #             expiration=datetime.timedelta(seconds=expiration),

    #             method='PUT',

    #             content_type='audio/mp3'  # MP3 파일에 맞는 콘텐츠 타입 설정

    #         )

    #         return url

    #     except GoogleCloudError as e:

    #         raise ValueError(f"Failed to generate signed URL: {e}")

    #     except Exception as e:

    #         raise ValueError(f"Unexpected error while generating signed URL: {e}")

       

    # class SignedURLSerializer(serializers.Serializer):

    #     user_id = serializers.IntegerField()  # 사용자 ID

    #     interview_id = serializers.IntegerField()  # 인터뷰 ID

 

    # class VoiceSignedURLView(APIView):

    #     permission_classes = [IsAuthenticated]

    #     parser_classes = [MultiPartParser, FormParser, JSONParser]

 

    #     def post(self, request, user_id, interview_id, *args, **kwargs):

    #         serializer = SignedURLSerializer(data=request.data)

    #         if serializer.is_valid():

    #             bucket_name = settings.GS_BUCKET_NAME

    #             try:

    #                 signed_urls = {}

    #                 for i in range(1, 3):  # 두 개의 MP3 파일을 위한 루프

    #                     blob_name = f"voice/{user_id}/{interview_id}/{i}.mp3"

    #                     signed_url = generate_signed_url(bucket_name, blob_name)

    #                     signed_urls[f"file_{i}"] = signed_url

                   

    #                 return Response({"signed_urls": signed_urls}, status=200)

    #             except ValueError as e:

    #                 return Response({"message": str(e)}, status=500)

    #         else:

    #             return Response(serializer.errors, status=400)


 

# 여기서부터 이서코드

nltk.download('punkt') # 1회만 다운로드 하면댐

 

def set_korean_font():

    font_path = os.path.join(settings.BASE_DIR, 'fonts', 'NanumGothic.ttf')

    if not os.path.isfile(font_path):

        raise RuntimeError(f"Font file not found: {font_path}")

    font_prop = fm.FontProperties(fname=font_path)

    plt.rc('font', family=font_prop.get_name())

 

credentials = service_account.Credentials.from_service_account_file(

    os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

)


 

class VoiceAPIView(APIView):

    parser_classes = [MultiPartParser, FormParser, JSONParser]  # 파일 업로드를 위해 MultiPartParser와 FormParser 사용

    permission_classes = [IsAuthenticated]

 

    def post(self, request, user_id, interview_id):

       

        # user_id = request.get('user_id')

        # question_id = request.get('question_id')  # question_id를 사용하여 question_list를 가져옵니다.

        #user_id = 2

        #question_id = 30

        user = get_object_or_404(User, id=user_id)

        question_list = get_object_or_404(QuestionLists, id=interview_id)  # QuestionLists 모델에서 객체를 가져옵니다.

        action = request.query_params.get('action', 'upload')  # 쿼리 파라미터로 'action' 값을 가져오고 기본값은 'upload'

        # interview_analysis = VoiceAnalysis(question_list=question_list)

        # interview_analysis.user = request.user

       

        if action == 'upload':

            return self.upload_file(request, question_list)  # 파일 업로드 처리

       

        elif action == 'merge':

            return self.merge_files_and_analyze(request, question_list)  # 파일 병합 및 분석 처리

        else:

            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)  # 유효하지 않은 action 처리

# 1001 6시 저장ㅇ

    # 음성 파일 받기

    def upload_file(self, request, question_list):

        print("111111")

        uploaded_files = request.FILES.getlist('files')

       

        user_id = request.data.get('user_id')

        question_id = request.data.get('question_id')

       

        if not uploaded_files:

            print("9999")

            return Response({"error": "No files uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # cnt = Counter(uploaded_files)

        # print('리스폰 뒤에', cnt) #로그

        upload_voice = os.path.join(settings.MEDIA_ROOT, 'uploads')

        print("파일 저장 경로 설정")

        if not os.path.exists(upload_voice):

            os.makedirs(upload_voice)

            print("디렉토리 생성")

 

        temp_file_data = []

        merge_audio = None

         

       

        for idx, file in enumerate(uploaded_files):

            # 파일 확장자 가져오기

            ext = os.path.splitext(file.name)[1]  # 확장자 포함 (.mp3, .wav 등)

            print("파일 확장자 확인",ext)

           

           

            # 파일명 설정: voice_파라미터1_파라미터2_파일순서.확장자 - 근데 user_id랑 question_id 저번에 빼서 쓸수가 없는 것 같습니다

            file_name = f"voice_{user_id}_{question_id}_{idx}{ext}"

            print("파일명 설정", file_name)

 

            # 저장 경로 설정

            voice_path = os.path.join(upload_voice, file_name)

            print("저장 경로 설정")

 

            # 파일을 지정된 경로에 저장

            with open(voice_path, 'wb+') as f:

                for chunk in file.chunks(chunk_size=8192):

                    f.write(chunk)

                    print("파일 경로에 저장")

       

        for idx, file in enumerate(uploaded_files):

            file_name = f"voice_{user_id}_{question_id}_{idx}{ext}"

            # 저장 경로 설정

            voice_path = os.path.join(upload_voice, file_name)

            print("저장 경로 설정")

           

            sound=AudioSegment.from_mp3(voice_path)

           

            if idx == 0 :

                merge_audio=sound

            else :

                merge_audio = merge_audio+sound

            #temp_file_data.append(voice_path)

            #self.analyze_audio(voice_path)

           

        # 최종 병합된 파일 = 분석 넣을 파일

        file_name = f"voice_{user_id}_{question_id}{ext}"

       

        # 저장 경로 설정

        voice_path = os.path.join(upload_voice, file_name)

        print("저장 경로 설정")

       

        merge_audio.export(voice_path, format="mp3")

               

        analysis_result = self.analyze_audio(voice_path, request)

           

        #question_list = "www"

               

        #데이터베이스에 분석 결과 저장

        interview_analysis = VoiceAnalysis(

            user=request.user,

            question_list=question_list,  # question_list로 교체합니다.

            pitch_graph=analysis_result["pitch_graph"],

            intensity_graph=analysis_result["intensity_graph"],

            pitch_summary=analysis_result["pitch_summary"],

            intensity_summary=analysis_result["intensity_summary"],

        )

        interview_analysis.save()

 

        return Response({"file_data": "aaa"}, status=status.HTTP_201_CREATED)

 

    def merge_files_and_analyze(self, request, question_list):

        temp_file_data = request.data.get('file_data')

        if not temp_file_data:

            return Response({"error": "No files to merge"}, status=status.HTTP_400_BAD_REQUEST)

        print(f"여기{question_list}")

       

        return Response({"error": "No files to merge"}, status=status.HTTP_200_OK)

    # except Exception as e:

    #     return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 

    def analyze_audio(self, voice_path, request):

        print("시작")

        snd = parselmouth.Sound(voice_path)

        #snd = parselmouth.Sound("C:\\Users\\iseo\\Desktop\\Backend-main_0910\\1.mp3")

        print("시작2", snd)

       

        pitch = snd.to_pitch()

        intensity = snd.to_intensity()

 

        pitch_values = pitch.selected_array['frequency']

        intensity_values = intensity.values.T

 

        pitch_mean = np.mean(pitch_values[pitch_values > 0])

        intensity_mean = np.mean(intensity_values)

 

        # 피치 그래프 생성

        pitch_fig, pitch_ax = plt.subplots()

        plt.close(pitch_fig) # 그래프 메모리 해제

        pitch_ax.plot(pitch.xs(), pitch_values, 'o', markersize=2)

        pitch_ax.set_xlabel("Time [s]")

        pitch_ax.set_ylabel("Pitch [Hz]")

        pitch_ax.set_title("Pitch Analysis")

        pitch_graph_url = self.fig_to_base64(pitch_fig, "pitch_analysis", request)

        # pitch_graph = self.fig_to_base64(pitch_fig) # base64 문자열 방식

 

        # 강도 그래프 생성

        intensity_fig, intensity_ax = plt.subplots()

        intensity_ax.plot(intensity.xs(), intensity_values, 'o', markersize=2)

        intensity_ax.set_xlabel("Time [s]")

        intensity_ax.set_ylabel("Intensity [dB]")

        intensity_ax.set_title("Intensity Analysis")

        intensity_graph_url = self.fig_to_base64(intensity_fig, "intensity_analysis", request)

        # intensity_graph = self.fig_to_base64(intensity_fig) # base64 문자열 방식


 

        # 총평 생성

        pitch_summary = self.get_pitch_summary(pitch_mean)

        intensity_summary = self.get_intensity_summary(intensity_mean)

 

        analysis_result = {

            "pitch_graph": pitch_graph_url,

            "intensity_graph": intensity_graph_url,

            "pitch_summary": pitch_summary,

            "intensity_summary": intensity_summary,

        }

        print("그래프 끝", analysis_result)

        return analysis_result

   

    # def fig_to_base64(self, fig):

    #     buf = BytesIO()

    #     fig.savefig(buf, format="png")

    #     buf.seek(0)

    #     fig_data = base64.b64encode(buf.read()).decode('utf-8')

    #     plt.close(fig)

    #     return fig_data

   

    def fig_to_base64(self, fig, graph_type, request):

       

        # 고유한 파일 이름 생성 (UUID)

        file_name = f"{graph_type}_{uuid.uuid4().hex}.jpeg"

        file_path = os.path.join(settings.MEDIA_ROOT, 'graphs', file_name)

 

        # 디렉토리가 존재하지 않으면 생성

        os.makedirs(os.path.dirname(file_path), exist_ok=True)

 

        # 파일로 저장

        fig.savefig(file_path)

 

        # 그래프 메모리 해제

        plt.close(fig)

       

        protocol = 'https' if request.is_secure() else 'http'

        host = request.get_host()  # 포트 O 호스트 O

        # host = request.get_host().split(':')[0] # 포트 X 호스트  O

        # port = '5173'

 

        # # URL 반환

        file_data = f"{protocol}://{host}/media/graphs/{file_name}" # 포트랑 호스트 둘 다 가져올 때

        # file_data = f"{protocol}://{host}:{port}/media/graphs/{file_name}"

        # file_data = f"http://localhost:5173/media/graphs/{file_name}"

 

        return file_data



 

    def get_pitch_summary(self, pitch_mean):

        if pitch_mean >= 450:

            return "목소리가 너무 크면 면접관에게 부담을 주거나 공격적인 인상을 줄 수 있습니다. 특히, 실내에서 큰 목소리는 불필요하게 면접관을 불편하게 할 수 있으며, 긴장감을 드러낼 수 있습니다. 면접은 주로 조용한 환경에서 진행되기 때문에, 목소리를 약간 낮추는 연습이 필요합니다. "

        elif pitch_mean >= 150:

            return "목소리가 크지 않으면서도 또렷하게 들리는 보통 크기의 목소리는 매우 이상적입니다. 면접관이 부담 없이 듣기 좋은 크기이며, 자신감과 침착함을 동시에 전달할 수 있습니다. 목소리 크기가 적절하므로 그대로 유지하면 좋습니다. "

        else:

            return "목소리가 너무 작으면 면접관이 내용을 잘 알아듣지 못하거나 자신감이 부족하다고 느낄 수 있습니다. 전달력이 약해지면 답변의 좋은 내용이 효과적으로 전달되지 않을 수 있습니다. 좀 더 또렷하고 크게 말하는 연습이 필요합니다. 소리의 울림과 발음을 정확히 하면서 자연스럽게 크기를 높이는 연습을 해보세요. "

 

    def get_intensity_summary(self, intensity_mean):

        if intensity_mean >= 65:

            return "면접에서 말이 너무 빠르면 면접관이 중요한 내용을 놓칠 수 있습니다. 중요한 포인트마다 잠시 멈추고, 다음 생각을 정리하는 습관을 들이세요. 답변 중간에 숨을 쉬면서 천천히 호흡을 조절하는 것이 중요합니다."

        elif intensity_mean >= 35:

            return "말의 속도가 자연스러워서 면접관이 듣기 편하고, 내용 전달력이 뛰어납니다. 질문에 대해 명확하고 체계적인 답변을 제공할 수 있습니다. 현재 말하는 속도가 적절하므로 자신감을 유지하며 자연스럽게 대화를 이어가면 됩니다. "

        else:

            return "말이 느리면 면접관이 답답함을 느낄 수 있으며, 면접이 길어질 수 있습니다. 이로 인해 준비가 부족하거나 자신감이 없어 보일 수 있습니다. 너무 느리게 말하지 않기 위해 답변을 머릿속에서 정리한 후 자신감 있게 말하는 연습이 필요합니다."

 

def correct_base64_padding(base64_string):

    return base64_string + '=' * (4 - len(base64_string) % 4)

 

def is_valid_base64(base64_string):

    try:

        if isinstance(base64_string, str):

            base64.b64decode(base64_string.encode('utf-8'))

            return True

    except binascii.Error:

        return False

    return False