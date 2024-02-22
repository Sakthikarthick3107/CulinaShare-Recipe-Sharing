from django.urls import path
from .views import RegisterView

# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshPairView
# )

urlpatterns = [
    path('users/register/' , RegisterView.as_view() , name='Register')
]
