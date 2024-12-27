import math
import numpy as np
import cv2
from .pupil import Pupil


class Eye(object):
#눈을 분리하고 동공을 감지하기 위한 새로운 프레임을 생성

    LEFT_EYE_POINTS = [36, 37, 38, 39, 40, 41]
    RIGHT_EYE_POINTS = [42, 43, 44, 45, 46, 47]

    def __init__(self, original_frame, landmarks, side, calibration):
        self.frame = None
        self.origin = None
        self.center = None
        self.pupil = None

        self._analyze(original_frame, landmarks, side, calibration)

    @staticmethod
    def _middle_point(p1, p2):
    #두 점 사이의 중간점 (x,y)을 반환. 
    #p1 (dlib.point): 첫 번째 점, p2 (dlib.point): 두 번째 점
        x = int((p1.x + p2.x) / 2)
        y = int((p1.y + p2.y) / 2)
        return x, y

    def _isolate(self, frame, landmarks, points):
        #눈을 분리하여 다른 얼굴 부분이 없는 프레임 획득 
        #frame (numpy.ndarray): 얼굴이 포함된 프레임
        #landmarks (dlib.full_object_detection): 얼굴 영역의 얼굴 특징점
        #points (list): 눈의 점들
        region = np.array([(landmarks.part(point).x, landmarks.part(point).y) for point in points])
        region = region.astype(np.int32)

        # 눈만 얻기 위해 마스크 적용
        height, width = frame.shape[:2]
        black_frame = np.zeros((height, width), np.uint8)
        mask = np.full((height, width), 255, np.uint8)
        cv2.fillPoly(mask, [region], (0, 0, 0))
        eye = cv2.bitwise_not(black_frame, frame.copy(), mask=mask)

        # 눈 자르기
        margin = 5
        min_x = np.min(region[:, 0]) - margin
        max_x = np.max(region[:, 0]) + margin
        min_y = np.min(region[:, 1]) - margin
        max_y = np.max(region[:, 1]) + margin

        self.frame = eye[min_y:max_y, min_x:max_x]
        self.origin = (min_x, min_y)

        height, width = self.frame.shape[:2]
        self.center = (width / 2, height / 2)

    def _blinking_ratio(self, landmarks, points):
        #눈 폭/눈 높이 로 감겼는지 나타내 계산된 비율 반환
        #(dlib.full_object_detection): 얼굴 영역의 얼굴 특징점,points (list): 눈의 점들 (68개의 Multi-PIE 특징점에서)

        left = (landmarks.part(points[0]).x, landmarks.part(points[0]).y)
        right = (landmarks.part(points[3]).x, landmarks.part(points[3]).y)
        top = self._middle_point(landmarks.part(points[1]), landmarks.part(points[2]))
        bottom = self._middle_point(landmarks.part(points[5]), landmarks.part(points[4]))

        eye_width = math.hypot((left[0] - right[0]), (left[1] - right[1]))
        eye_height = math.hypot((top[0] - bottom[0]), (top[1] - bottom[1]))

        try:
            ratio = eye_width / eye_height
        except ZeroDivisionError:
            ratio = None

        return ratio

    def _analyze(self, original_frame, landmarks, side, calibration):
        """새로운 프레임에서 눈을 감지하고 분리하여 보정을 위한 데이터를 보내고 Pupil 객체 초기화

        Arguments:
            original_frame (numpy.ndarray): 사용자가 전달한 프레임
            landmarks (dlib.full_object_detection): 얼굴 영역의 얼굴 특징점
            side: 왼쪽 눈인지 (0) 오른쪽 눈인지 (1)
            calibration (calibration.Calibration): 이진화 임계값을 관리
        """
        if side == 0:
            points = self.LEFT_EYE_POINTS
        elif side == 1:
            points = self.RIGHT_EYE_POINTS
        else:
            return

        # self.gaze_ratio = self.get_gaze_ratio(original_frame, landmarks, points)
        self.blinking = self._blinking_ratio(landmarks, points)
        self._isolate(original_frame, landmarks, points)

        if not calibration.is_complete():
            calibration.evaluate(self.frame, side)

        threshold = calibration.threshold(side)
        self.pupil = Pupil(self.frame, threshold)
