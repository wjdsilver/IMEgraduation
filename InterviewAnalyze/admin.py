from django.contrib import admin
from .models import InterviewAnalysis
from .models import VoiceAnalysis

admin.site.register(InterviewAnalysis)
admin.site.register(VoiceAnalysis)