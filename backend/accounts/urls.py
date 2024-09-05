from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    UserRegistraionAPIView,
    UserLoginAPIView,
    UserLogoutAPIView,
    UserInfoAPIView,
    AllUsersInfoAPIView,
)

urlpatterns = [
    path("register/", UserRegistraionAPIView.as_view(), name="register"),
    path("login/", UserLoginAPIView.as_view(), name="login"),
    path("logout/", UserLogoutAPIView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/", AllUsersInfoAPIView.as_view(), name="users_info"),
    path("users/<int:id>", UserInfoAPIView.as_view(), name="user_info"),
]
