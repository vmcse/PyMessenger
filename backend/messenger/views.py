from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Message, ChatRoom
from .serializers import MessageSerializer


class ChatRoomMessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        room_name = self.kwargs.get("room_name")
        chat_room = ChatRoom.objects.get(name=room_name)
        return Message.objects.filter(chat_room=chat_room).order_by("timestamp")
