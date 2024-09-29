from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, BorrowedBook
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'user')
        )
        return user

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class BorrowedBookSerializer(serializers.ModelSerializer):
    book = serializers.StringRelatedField()
    deadline_status = serializers.SerializerMethodField()

    class Meta:
        model = BorrowedBook
        fields = ['book', 'borrowed_time', 'return_time', 'actual_return_time', 'deadline_status']

    def get_deadline_status(self, obj):
        # Ensure we compare datetime objects
        if obj.return_time and obj.return_time < timezone.now():
            return "Overdue"
        return "Within Deadline"
