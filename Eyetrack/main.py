import cv2
import numpy as np
import csv
import time
import threading
import requests
from .gaze_tracking import GazeTracking
from django.conf import settings
import os

class GazeTrackingSession:
    def __init__(self, video_url=None, status="initialized", user_id=0, interview_id=0):
        self.sections = {
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0,
            "E": 0,
            "F": 0
        }
        self.section = "None"
        self.thread = None
        self.running = False
        self.video_url = video_url
        self.status = status
        self.user_id = user_id
        self.interview_id = interview_id

    def Section(self, where):
        if where in self.sections:
            self.sections[where] += 1
            return self.sections[where]

    def start_eye_tracking(self, video_path):
        if video_path is None:
            raise ValueError("Video path must not be None")
        
        print("Starting eye tracking...")
        self.running = True
        self.video_path = video_path
        avg_left_hor_gaze = 0
        avg_right_hor_gaze = 0
        avg_top_ver_gaze = 0
        avg_bottom_ver_gaze = 0

        total_left_hor_gaze = 0
        total_right_hor_gaze = 0
        total_top_ver_gaze = 0
        total_bottom_ver_gaze = 0

        left_hor_gaze_count = 0
        right_hor_gaze_count = 0
        top_ver_gaze_count = 0
        bottom_ver_gaze_count = 0

        webcam = cv2.VideoCapture(video_path)
        if not webcam.isOpened():
            raise IOError(f"Cannot open video file: {video_path}")

        flag = 0
        gaze = GazeTracking()
        frame_rate = int(webcam.get(cv2.CAP_PROP_FPS))
        frame_count = 0

        while self.running:
            _, frame = webcam.read()

            if frame is None:
                print("left:",{avg_left_hor_gaze},"right",{avg_right_hor_gaze},"top",{avg_top_ver_gaze},"bottom",{avg_bottom_ver_gaze})
                #print("경계 r",{bound_hor_right_gaze},"경계 l", {bound_hor_left_gaze}, "경계 ud",{bound_ver_gaze})
                print("Frame is None, stopping eye tracking.")
                self.stop_eye_tracking()
                break

            frame_count += 1
            gaze.refresh(frame)
            frame, loc1, loc2 = gaze.annotated_frame()

            # Calibration Period (First 30 seconds)
            if frame_count <= 24 * frame_rate:
                if frame_count==10*frame_rate:
                    print("캘리브레이션")
                elif 11 * frame_rate <= frame_count < 12 * frame_rate:
                    if gaze.horizontal_ratio() is not None and gaze.vertical_ratio() is not None:
                        total_left_hor_gaze += gaze.horizontal_ratio()
                        total_top_ver_gaze += gaze.vertical_ratio()
                        left_hor_gaze_count += 1  # Increment count for left horizontal gaze
                        top_ver_gaze_count += 1 
                elif 14 * frame_rate <= frame_count < 15 * frame_rate:
                    if gaze.horizontal_ratio() is not None and gaze.vertical_ratio() is not None:
                        total_right_hor_gaze += gaze.horizontal_ratio()
                        total_top_ver_gaze += gaze.vertical_ratio()
                        right_hor_gaze_count += 1  # Increment count for right horizontal gaze
                        top_ver_gaze_count += 1
                elif 17 * frame_rate <= frame_count < 18 * frame_rate:
                    if gaze.horizontal_ratio() is not None and gaze.vertical_ratio() is not None:
                        total_left_hor_gaze += gaze.horizontal_ratio()
                        total_bottom_ver_gaze += gaze.vertical_ratio()
                        left_hor_gaze_count += 1   # Increment count for left horizontal gaze
                        bottom_ver_gaze_count += 1
                elif 20 * frame_rate <= frame_count < 21 * frame_rate:
                    if gaze.horizontal_ratio() is not None and gaze.vertical_ratio() is not None:
                        total_right_hor_gaze += gaze.horizontal_ratio()
                        total_bottom_ver_gaze += gaze.vertical_ratio()
                        right_hor_gaze_count += 1  # Increment count for right horizontal gaze
                        bottom_ver_gaze_count += 1

            # After calibration: start actual eye tracking
            elif frame_count > 24 * frame_rate:
                if flag == 0:
                    # Calculate averages after calibration
                    avg_left_hor_gaze = total_left_hor_gaze / left_hor_gaze_count
                    avg_right_hor_gaze = total_right_hor_gaze / right_hor_gaze_count
                    avg_top_ver_gaze = total_top_ver_gaze / top_ver_gaze_count
                    avg_bottom_ver_gaze = total_bottom_ver_gaze / bottom_ver_gaze_count
                    #
                    bound_ver_gaze=(avg_top_ver_gaze+avg_bottom_ver_gaze)/2
                    bound_hor_right_gaze=(avg_left_hor_gaze +avg_right_hor_gaze)/3*1
                    bound_hor_left_gaze=(avg_left_hor_gaze +avg_right_hor_gaze)/3*2

                    #
                    print("left:",{avg_left_hor_gaze},"right",{avg_right_hor_gaze},"top",{avg_top_ver_gaze},"bottom",{avg_bottom_ver_gaze})
                    flag = 1

                # Gaze detection based on calibrated averages
                if gaze.is_blinking():
                    text = "Blinking"
                elif gaze.is_top_left(avg_left_hor_gaze, avg_top_ver_gaze):
                    text = "Looking top left"
                    self.section = "A"
                elif gaze.is_top_center(avg_right_hor_gaze, avg_left_hor_gaze, avg_top_ver_gaze):
                    text = "Looking top center"
                    self.section = "B"
                elif gaze.is_top_right(avg_right_hor_gaze, avg_top_ver_gaze):
                    text = "Looking top right"
                    self.section = "C"
                elif gaze.is_bottom_left(avg_left_hor_gaze, avg_top_ver_gaze):
                    text = "Looking bottom left"
                    self.section = "D"
                elif gaze.is_bottom_center(avg_right_hor_gaze, avg_left_hor_gaze, avg_top_ver_gaze):
                    text = "Looking bottom center"
                    self.section = "E"
                elif gaze.is_bottom_right(avg_right_hor_gaze, avg_top_ver_gaze):
                    text = "Looking bottom right"
                    self.section = "F"
                print(self.section, ":", self.Section(self.section))

        webcam.release()
        cv2.destroyAllWindows()
        print("Eye tracking ended.")

    def stop_eye_tracking(self):
        self.running = False
        if self.thread is not None:
            self.thread.cancel()

        # Saving the section data to CSV
        csv_filename = os.path.join(settings.BASE_DIR, f"Eyetrack\\0518\\{self.user_id}_{self.interview_id}_gaze_sections.csv")
        csv_header = ["Section", "Count"]

        with open(csv_filename, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(csv_header)
            for section_name, count in self.sections.items():
                writer.writerow([section_name, count])

        print(f"Data saved to: {csv_filename}")
        return csv_filename
