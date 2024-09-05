from django.urls import path

from .views import ChatRoomMessagesView

urlpatterns = [
    path("messages/<str:room_name>/", ChatRoomMessagesView.as_view(), name="chat-room"),
]
