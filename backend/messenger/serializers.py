from rest_framework import serializers

from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "sender", "recipient", "content", "timestamp"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["sender"] = instance.sender.username
        representation["recipient"] = instance.recipient.username
        return representation
