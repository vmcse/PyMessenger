from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync

from .models import ChatRoom, Message

User = get_user_model()


def get_room_name(user1, user2):
    participants = sorted([user1.username, user2.username])
    return f"chat_{participants[0]}_{participants[1]}"


class ChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user1 = None
        self.user2 = None
        self.chat_room = None

    def connect(self):
        self.user1 = User.objects.get(
            username=self.scope["url_route"]["kwargs"]["user1"]
        )
        self.user2 = User.objects.get(
            username=self.scope["url_route"]["kwargs"]["user2"]
        )
        self.room_name = get_room_name(self.user1, self.user2)
        print(self.room_name)
        self.room_group_name = f"chat_{self.room_name}"

        chat_room, created = ChatRoom.objects.get_or_create(name=self.room_name)
        print("Room created:", created)

        if created:
            chat_room.participants.add(self.user1, self.user2)

        self.chat_room = chat_room
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def receive_json(self, event):
        sender = User.objects.get(id=event["sent_by"])
        recipient = self.user1 if self.user1 != sender else self.user2
        print(f"Sender: {sender}")
        print(f"Recipeint: {recipient}")

        new_message = Message.objects.create(
            sender=sender,
            recipient=recipient,
            content=event["message"],
            chat_room=self.chat_room,
        )

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat.message",
                "new_message": {
                    "id": new_message.id,
                    "sender": new_message.sender.username,
                    "recipient": new_message.recipient.username,
                    "content": new_message.content,
                    "timestamp": new_message.timestamp.isoformat(),
                },
            },
        )

    def chat_message(self, event):
        print(event)
        self.send_json(event)

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
