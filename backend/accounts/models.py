from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
    imageUrl = models.URLField(
        blank=True,
        null=True,
        default="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1717452763~exp=1717456363~hmac=31c151489e7009e4f2505e410161b24c47ca217a11d31680266c15f1c70e76ee&w=740",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email
