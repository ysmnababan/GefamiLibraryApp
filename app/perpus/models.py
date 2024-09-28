from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _  # Use gettext_lazy instead of ugettext_lazy

class User(AbstractUser):
    # Override the username field
    username = models.CharField(max_length=50, unique=True, blank=False, null=False)
    
    # Email field
    email = models.EmailField(_('email address'), unique=True)

    # Role field
    role = models.CharField(max_length=20, choices=[('user', 'User'), ('admin', 'Admin')], default='user')

    # Override USERNAME_FIELD and REQUIRED_FIELDS
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role'] 

    def __str__(self):
        return self.email

class Book(models.Model):
    name = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    publisher = models.CharField(max_length=255)

    class Meta:
        unique_together = ('name', 'author')

    def __str__(self):
        return f'{self.name} by {self.author}'


class BorrowedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrowed_time = models.DateTimeField(auto_now_add=True)
    return_time = models.DateTimeField()  # When the book is supposed to be returned
    actual_return_time = models.DateTimeField(null=True, blank=True)  # Can be null if not yet returned

    def __str__(self):
        return f'{self.user.username} borrowed {self.book.name}'
