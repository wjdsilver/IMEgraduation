from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView # 루트 경로 리다이렉트 추가


urlpatterns = [
    path('', include('test.urls')),
    path('admin/', admin.site.urls),
    path('interview_questions/', include('QuestionList.urls')),
    path('users/', include('Users.urls')),
    path('interview/', include('InterviewAnalyze.urls')),
    path('mylog/', include("myLog.urls")),
    path('eyetrack/', include('Eyetrack.urls')),
    path('pose/', include('poseAnalyze.urls')),
    path('', RedirectView.as_view(url='/interview_questions/'))  # 루트 경로 리다이렉트 추가
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
