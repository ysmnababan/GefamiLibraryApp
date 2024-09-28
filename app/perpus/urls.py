from django.urls import path
from .views import RegisterView, LoginView, BookListView, BorrowBookView, ReturnBookView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('books/', BookListView.as_view(), name='books-list'),
    path('borrow/<int:id>/', BorrowBookView.as_view(), name='borrow-book'),
    path('return/', ReturnBookView.as_view(), name='return-book'),
]
