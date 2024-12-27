import subprocess
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from .main import GazeTrackingSession
from .models import GazeTrackingResult, Video
import cv2
import pandas as pd
import base64
import io
import socket
from PIL import Image
import numpy as np
import os
import logging
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from .serializers import VideoSerializer, SignedURLSerializer, GazeStatusSerializer, GazeTrackingResultSerializer
from django.conf import settings
from google.cloud import storage
from google.cloud.exceptions import GoogleCloudError
import datetime
import requests
from django.shortcuts import get_object_or_404
from django.core.exceptions import MultipleObjectsReturned
from .models import GazeTrackingResult, Video
from .tasks import process_gaze_tracking


logger = logging.getLogger(__name__)
permission_classes = [IsAuthenticated]
gaze_sessions = {}

def get_local_ip():
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    return local_ip

def generate_signed_url(bucket_name, blob_name, expiration=86400):
    client = storage.Client()
    try:
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        url = blob.generate_signed_url(
            expiration=datetime.timedelta(seconds=expiration),
            method='PUT'
        )
        return url
    except GoogleCloudError as e:
        raise ValueError(f"서명된 URL 생성 실패: {e}")
    except Exception as e:
        raise ValueError(f"서명된 URL 생성 중 예기치 않은 오류 발생: {e}")


class SignedURLView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, user_id, interview_id, *args, **kwargs):
        serializer = SignedURLSerializer(data=request.data)
        if serializer.is_valid():
            bucket_name = settings.GS_BUCKET_NAME
            blob_name = f"videos/{user_id}/{interview_id}/input.mp4"
            try:
                signed_url = generate_signed_url(bucket_name, blob_name)
                key = f"{user_id}_{interview_id}"
                if key not in gaze_sessions:
                    gaze_sessions[key] = GazeTrackingSession(video_url=signed_url, status="initialized")
                return JsonResponse({"signed_url": signed_url}, status=200)
            except ValueError as e:
                return JsonResponse({"message": str(e)}, status=500)
        else:
            return JsonResponse(serializer.errors, status=400)




# class VideoUploadView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, user_id, interview_id):
#         file_url = f'https://storage.googleapis.com/{settings.GS_BUCKET_NAME}/videos/{user_id}/{interview_id}/input.webm'
#         video = Video.objects.create(user_id=user_id, interview_id=interview_id, file=file_url)


#         return JsonResponse({'message': 'Video saved successfully', 'video_id': 9999}, status=201)

class VideoUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id, interview_id):
        # 프론트엔드에서 업로드된 파일을 받음
        video_file = request.FILES.get('file')
        file_size = video_file.size
        print(f"filesize:{file_size}")

        # 파일이 업로드되지 않았을 경우 에러 반환
        if not video_file:
            logger.error('No file uploaded')
            return JsonResponse({'error': 'No file provided'}, status=400)

        # 파일 저장 경로 설정
        file_path = f'videos\\{user_id}_{interview_id}_input.mp4'
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)

        # full_path 로그 또는 출력 확인
        logger.info(f"Full path: {full_path}")
        print(f"Full path: {full_path}")

        try:
            print("000")
            # 파일을 서버의 저장소에 저장
            with open(full_path, 'wb+') as destination:
                print("111")
                for chunk in video_file.chunks():
                # print("222")
                    destination.write(chunk)
                # destination.write(video_file)
                print("333")
                # destination.close()
            # FFmpeg를 사용해 비트레이트 설정 (예: 1M 비트레이트)
            output_file = f'videos/{user_id}_{interview_id}_output.mp4'
            output_path = os.path.join(settings.MEDIA_ROOT, output_file)

            # try:
                # FFmpeg 명령어: 비트레이트를 1Mbps로 설정하여 새 파일 생성
                # command = [
                #     'ffmpeg', '-i', full_path, '-b:v', '1M', output_path
                # ]
                # subprocess.run(command, check=True)
            #FFmpeg 명령어: 비트레이트를 1Mbps로 설정하여 새 파일 생성
            # command = [
                    # 'ffmpeg', '-i', full_path, '-b:v', '1M', output_path
            # ]
            # subprocess.run(command, check=True)
            
            print("44")
            # 파일 저장이 완료되면 로그 남기기
            logger.info(f"File saved to {full_path}")

            # Video 객체 생성 (DB에 경로 저장)
            video = Video.objects.create(user_id=user_id, interview_id=interview_id, file=file_path)
            gazeTrackingSession=GazeTrackingSession(video_url=full_path, status="initialized",user_id=user_id,interview_id=interview_id)
            gazeTrackingSession.start_eye_tracking(gazeTrackingSession.video_url)
            return JsonResponse({'message': 'Video saved with adjusted bitrate', 'video_id': video.id}, status=201)

        except subprocess.CalledProcessError as e:
            return JsonResponse({'error': f'FFmpeg error: {str(e)}'}, status=500)
            

            return JsonResponse({'message': 'Video saved successfully', 'video_id': video.id}, status=201)

        except Exception as e:
            # 예외가 발생하면 에러 로그 기록
            logger.error(f"Error saving file: {str(e)}")
            return JsonResponse({'error': 'File upload failed'}, status=500)


def download_video_from_public_url(video_url, local_path):
    """원격 URL에서 비디오를 다운로드하여 로컬 파일로 저장"""
    try:
        response = requests.get(video_url, stream=True)
        if response.status_code == 200:
            os.makedirs(os.path.dirname(local_path), exist_ok=True)  # 디렉토리가 없는 경우 생성
            with open(local_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            logger.info(f"File downloaded successfully to {local_path}")
        else:
            error_msg = f"Failed to download file, status code: {response.status_code}. URL: {video_url}"
            logger.error(error_msg)
            raise ValueError(error_msg)
    except Exception as e:
        logger.error(f"Error downloading video from public URL: {e}")
        raise

def start_gaze_tracking_view(request, user_id, interview_id):
    key = f"{user_id}_{interview_id}"

    try:
        # 비디오 파일의 GCS URL을 생성합니다.
        video_url = f'https://storage.googleapis.com/{settings.GS_BUCKET_NAME}/videos/{user_id}/{interview_id}/input.mp4'

        # `media` 폴더 내에 로컬 경로 생성
        local_video_path = os.path.join(settings.BASE_DIR, 'media', f'{user_id}_{interview_id}_input.mp4')

        # 원격 URL에서 로컬로 다운로드
        download_video_from_public_url(video_url, local_video_path)
    except ValueError as e:
        logger.error(f"Failed to download video: {e}")
        return JsonResponse({"message": str(e)}, status=404)
    except Exception as e:
        logger.error(f"Unexpected error during video download: {e}")
        return JsonResponse({"message": f"Unexpected error during video download: {str(e)}"}, status=500)

    try:
        # 세션을 `gaze_sessions`에 추가
        if key not in gaze_sessions:
            gaze_sessions[key] = GazeTrackingSession(video_url=video_url, status="initialized")
        else:
            logger.warning(f"Session already exists for user_id={user_id} and interview_id={interview_id}")

        # Celery 작업으로 시선 추적 분석을 비동기적으로 실행
        process_gaze_tracking.delay(user_id, interview_id, local_video_path)
        return JsonResponse({"message": "Gaze tracking started, processing in background"}, status=200)
    except Exception as e:
        logger.error(f"Error initiating gaze tracking: {e}")
        return JsonResponse({"message": f"Error initiating gaze tracking: {str(e)}"}, status=500)


def apply_gradient(center, radius, color, image, text=None):
    overlay = image.copy()
    cv2.circle(overlay, center, radius, color, -1)
    cv2.addWeighted(overlay, 0.5, image, 0.5, 0, image)
    if text:
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 30.0
        font_color = (255, 255, 255)
        thickness = 20
        text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]
        text_x = center[0] - text_size[0] // 2
        text_y = center[1] + text_size[1] // 2
        cv2.putText(image, text, (text_x, text_y), font, font_scale, font_color, thickness)

def assign_colors_and_numbers(section_counts):
    colors = [
        (38, 38, 255), (59, 94, 255), (55, 134, 255),
        (51, 173, 255), (26, 210, 255), (0, 255, 255)
    ]
    sorted_sections = sorted(section_counts.items(), key=lambda item: item[1], reverse=True)
    color_map = {}
    number_map = {}
    for i, (section, _) in enumerate(sorted_sections):
        color_map[section] = colors[i % len(colors)]
        number_map[section] = str(i + 1)
    return color_map, number_map

def draw_heatmap(image, section_counts):
    height, width, _ = image.shape
    section_centers = {
            "A": (int(width / 6), int(height / 4)),
            "B": (int(width / 2), int(height / 4)),
            "C": (int(5 * width / 6), int(height / 4)),
            "D": (int(width / 6), int(3 * height / 4)),
            "E": (int(width / 2), int(3 * height / 4)),
            "F": (int(5 * width / 6), int(3 * height / 4))
        }
    color_map, number_map = assign_colors_and_numbers(section_counts)
    for section, count in section_counts.items():
        if count > 0 and section in section_centers:
            center = section_centers[section]
            color = color_map[section]
            number = number_map[section]
            radius = 700
            #radius = int(width / 12)  # Dynamic radius based on image width
            apply_gradient(center, radius, color, image, number)



# # 히트맵 png 스토리지 업로드
# def upload_image_to_gcs(bucket_name, blob_name, image_content):
#     client = storage.Client()
#     bucket = client.bucket(bucket_name)
#     blob = bucket.blob(blob_name)

#     blob.upload_from_string(image_content, content_type='image/png')
#     # 공개 액세스를 위해 파일을 공개 설정
#     blob.make_public()
#     return blob.public_url

# 이미지 스토리지 업로드 아닌 버전
# def stop_gaze_tracking_view(request, self ):
# def stop_gaze_tracking_view(self):
def stop_gaze_tracking_view(self,user_id,interview_id):


    # key = f"{user_id}_{interview_id}"
    # print(f"Initialized gaze session for {key}")
    print(f"Initialized gaze session for {user_id}")


    # if key not in gaze_sessions:
        # return JsonResponse({"message": "Session not found", "status": "error"}, status=404)

    # gaze_session = gaze_sessions[key]
    # csv_filename = gaze_session.stop_eye_tracking()
    # csv_filename = os.path.join(settings.BASE_DIR, f"Eyetrack\\0518\\{self.user_id}_{self.interview_id}_gaze_sections.csv")
    csv_filename = os.path.join(settings.BASE_DIR, f"Eyetrack\\0518\\{user_id}_{interview_id}_gaze_sections.csv")

    section_data = pd.read_csv(csv_filename)
    section_counts = dict(zip(section_data["Section"], section_data["Count"]))
    image_path = os.path.join(settings.BASE_DIR, "Eyetrack", "0518", "image.png")
    original_image = cv2.imread(image_path)
    if original_image is None:
        return JsonResponse({"message": "Image not found", "status": "error"}, status=404)

    heatmap_image = original_image.copy()
    draw_heatmap(heatmap_image, section_counts)


    # 0929 추가 
    # 이미지 파일을 로컬에 저장
    #output_image_path = os.path.join(settings.MEDIA_ROOT, f'gaze_images/{user_id}_{interview_id}_heatmap.png')
    output_image_path = os.path.join('C:\KJE\IME_graduation\ddock_final\ddok_front\public\eyeresult',
        f'{user_id}_{interview_id}_heatmap.jpeg')
    cv2.imwrite(output_image_path, heatmap_image)  # OpenCV를 사용하여 파일로 저장
    #local_ip = get_local_ip()
    #image_url = f'http://127.0.0.1:8000/media/gaze_images/{user_id}_{interview_id}_heatmap.png'
    #image_url=f'./assets/eyeresult/{user_id}_{interview_id}_heatmap.png'
    image_url=f'/{user_id}_{interview_id}_heatmap.jpeg'
    #image_url = gaze_tracking_result.result_image.url

    # GazeTrackingResult에 이미지 저장
    gaze_tracking_result = GazeTrackingResult.objects.create(
        user_id=user_id,
        interview_id=interview_id,
        #encoded_image=f'gaze_images/{user_id}_{interview_id}_heatmap.png',  # 이미지 경로를 저장
        image_url=image_url,
        feedback=get_feedback(section_counts)
    )

    # 이미지 URL 생성
    #image_url = gaze_tracking_result.encoded_image.url  # 이 필드는 저장된 이미지의 URL을 생성해줌
    #image_url=output_image_path
    #video = Video.objects.filter(user_id=user_id, interview_id=interview_id).first()
    #video_url = video.file.url if video else None

    return JsonResponse({
        "message": "Gaze tracking stopped",
        "image_url": image_url,  # 이미지 URL 반환
        #"video_url": video_url,
        "feedback": gaze_tracking_result.feedback,
        "status": "success"
    }, status=200)


    # #인코딩해서 넘길때
    # _, buffer = cv2.imencode('.png', heatmap_image)
    # encoded_image_data = "data:image/png;base64," + base64.b64encode(buffer).decode('utf-8')
    # feedback = get_feedback(section_counts)

    # # video = Video.objects.filter(user_id=user_id, interview_id=interview_id).first()
    # # video = Video.objects.filter(user_id=self.user_id, interview_id=self.interview_id).first()
    # video = Video.objects.filter(user_id=user_id, interview_id=interview_id).first()

    # video_url = video.file.url if video else None

    # gaze_tracking_result = GazeTrackingResult.objects.create(
    #     # user_id=self.user_id,
    #     user_id=user_id,
    #     # interview_id=self.interview_id,
    #     interview_id=interview_id,
    #     encoded_image=encoded_image_data,
    #     feedback=feedback
    # )

    # local_video_path = os.path.join(settings.MEDIA_ROOT, f"{user_id}_{interview_id}.mp4")
    # # local_video_path = os.path.join(settings.MEDIA_ROOT, f"{self.user_id}_{self.interview_id}.webm")

    # if os.path.exists(local_video_path):
    #     os.remove(local_video_path)
    # # del gaze_sessions[key]

    # return JsonResponse({
    #     "message": "Gaze tracking stopped",
    #     "image_data": gaze_tracking_result.encoded_image,
    #     "video_url": video_url,
    #     "feedback": feedback,
    #     "status": "success"
    # }, status=200)

# def stop_gaze_tracking_view(request, user_id, interview_id):
#     key = f"{user_id}_{interview_id}"
#     if key not in gaze_sessions:
#         return JsonResponse({"message": "Session not found", "status": "error"}, status=404)

#     gaze_session = gaze_sessions[key]
#     csv_filename = gaze_session.stop_eye_tracking()
#     section_data = pd.read_csv(csv_filename)
#     section_counts = dict(zip(section_data["Section"], section_data["Count"]))
#     image_path = os.path.join(settings.BASE_DIR, "Eyetrack", "0518", "image.png")
#     original_image = cv2.imread(image_path)
#     if original_image is None:
#         return JsonResponse({"message": "Image not found", "status": "error"}, status=404)

#     heatmap_image = original_image.copy()
#     draw_heatmap(heatmap_image, section_counts)
#     _, buffer = cv2.imencode('.png', heatmap_image)
#     encoded_image_data = buffer.tobytes()

#     # 이미지를 GCS에 업로드하고 공개 URL 받기
#     bucket_name = settings.GS_BUCKET_NAME
#     blob_name = f"results/{user_id}/{interview_id}/heatmap.png"
#     image_url = upload_image_to_gcs(bucket_name, blob_name, encoded_image_data)

#     feedback = get_feedback(section_counts)
#     video = Video.objects.filter(user_id=user_id, interview_id=interview_id).first()
#     video_url = video.file.url if video else None

#     gaze_tracking_result = GazeTrackingResult.objects.create(
#         user_id=user_id,
#         interview_id=interview_id,
#         encoded_image=image_url,  # 이제 URL을 저장
#         feedback=feedback
#     )

#     local_video_path = os.path.join(settings.MEDIA_ROOT, f"{user_id}_{interview_id}.webm")
#     if os.path.exists(local_video_path):
#         os.remove(local_video_path)
#     del gaze_sessions[key]

#     return JsonResponse({
#         "message": "Gaze tracking stopped",
#         "image_url": image_url,  # URL을 JsonResponse에 포함시킴
#         "video_url": video_url,
#         "feedback": feedback,
#         "status": "success"
#     }, status=200)




def get_feedback(section_counts):
    max_section = max(section_counts, key=section_counts.get)
    feedback = "면접관을 잘 응시하고 있습니다. 면접에서는 면접관을 응시하면서 은은한 미소를 띄는것이 중요합니다."
    if max_section == 'A':
        feedback = "면접관의 왼쪽을 많이 응시하고 있습니다. 면접관을 조금 더 응시하려고 노력해 보세요."
    elif max_section == 'C':
        feedback = "면접관의 오른쪽을 많이 응시하고 있습니다. 면접관을 조금 더 응시하려고 노력해 보세요."
    elif max_section == 'D':
        feedback = "면접관의 왼쪽을 많이 응시하고 있습니다. 면접관을 조금 더 응시하려고 노력해 보세요."
    elif max_section == 'F':
        feedback = "면접관의 오른쪽을 많이 응시하고 있습니다. 면접관을 조금 더 응시하려고 노력해 보세요."
    return feedback


#0929 추가 항목----------------------------------------
