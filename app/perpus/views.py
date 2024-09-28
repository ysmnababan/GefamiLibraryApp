from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Book, BorrowedBook
from .serializers import RegisterSerializer, UserSerializer, BookSerializer, BorrowedBookSerializer

# Registration
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

# Login
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Admin - List all books
class BookListView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

# Borrow a book
class BorrowBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            book = Book.objects.get(id=id)
            if book.quantity < 1:
                return Response({'error': 'Book not available'}, status=status.HTTP_400_BAD_REQUEST)

            book.quantity -= 1
            book.save()

            borrowed_book = BorrowedBook.objects.create(
                user=request.user,
                book=book,
                return_time=request.data.get('return_time')
            )
            return Response(BorrowedBookSerializer(borrowed_book).data, status=status.HTTP_201_CREATED)

        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

# Return a book
class ReturnBookView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        borrowed_book_id = request.data.get('borrowed_book_id')
        try:
            borrowed_book = BorrowedBook.objects.get(id=borrowed_book_id, user=request.user, actual_return_time__isnull=True)
            borrowed_book.actual_return_time = request.data.get('actual_return_time')
            borrowed_book.save()

            # Increase the book quantity back
            borrowed_book.book.quantity += 1
            borrowed_book.book.save()

            return Response({'message': 'Book returned successfully'})
        except BorrowedBook.DoesNotExist:
            return Response({'error': 'Borrow record not found'}, status=status.HTTP_404_NOT_FOUND)
from django.shortcuts import render
