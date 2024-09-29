from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Book, BorrowedBook
from .serializers import RegisterSerializer, UserSerializer, BookSerializer, BorrowedBookSerializer
from datetime import datetime
from rest_framework.permissions import BasePermission
from django.utils import timezone



class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"Validation errors: {serializer.errors}")  # Print errors for debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()  # This will call the create method in the serializer
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Book, BorrowedBook
from .serializers import BookSerializer, BorrowedBookSerializer

class BookListView(generics.ListAPIView):
    def get_permissions(self):
        # Check if 'available' is in the query parameters
        if 'available' in self.request.query_params:
            # Allow anyone to access available books
            return [AllowAny()]
        # Require authentication for other queries
        return [IsAuthenticated()]
    
    def get_queryset(self):
        # Get the query parameters from the URL
        query_params = self.request.query_params
        available = query_params.get('available', None)
        borrowed = query_params.get('borrowed', None)
        user_borrowed = query_params.get('user_borrowed', None)

        # Base queryset
        queryset = Book.objects.all()

        # 1. Filter by available books (books that have quantity > 0)
        if available is not None:
            queryset = queryset.filter(quantity__gt=0)

        # 2. Filter by borrowed books
        if borrowed is not None:
            
            borrowed_books = BorrowedBook.objects.filter(actual_return_time__isnull=True)
            
            book_ids = borrowed_books.values_list('book_id', flat=True)
            queryset = queryset.filter(id__in=book_ids)

            
            return borrowed_books  

        # 3. Filter by books borrowed by the current user
        if user_borrowed is not None:
            if self.request.user.role == 'user':
                borrowed_books = BorrowedBook.objects.filter(user=self.request.user, actual_return_time__isnull=True)
                book_ids = borrowed_books.values_list('book_id', flat=True)
                queryset = queryset.filter(id__in=book_ids)
                return borrowed_books
            else:
                raise PermissionError("Only users can view their own borrowed books.")

        return queryset

    def get_serializer_class(self):
        
        if 'borrowed' in self.request.query_params or 'user_borrowed' in self.request.query_params:
            return BorrowedBookSerializer  
        return BookSerializer

# Borrow a book
class BorrowBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            # Check if the user already has a borrowed book
            existing_borrowed_book = BorrowedBook.objects.filter(user=request.user, actual_return_time__isnull=True).first()
            if existing_borrowed_book:
                return Response({'error': 'You can only borrow one book at a time.'}, status=status.HTTP_400_BAD_REQUEST)

            # Get the book to borrow
            book = Book.objects.get(id=id)
            if book.quantity < 1:
                return Response({'error': 'Book not available'}, status=status.HTTP_400_BAD_REQUEST)

            # Parse return_time from the request and validate it
            return_time_str = request.data.get('return_time')
            if return_time_str:
                try:
                    return_time = datetime.fromisoformat(return_time_str)  # Ensure it is converted to a datetime object
                except ValueError:
                    return Response({'error': 'Invalid return time format. Use ISO 8601 format.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Return time is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Update the book's quantity
            book.quantity -= 1
            book.save()

            # Create the BorrowedBook record
            borrowed_book = BorrowedBook.objects.create(
                user=request.user,
                book=book,
                return_time=return_time
            )

            return Response(BorrowedBookSerializer(borrowed_book).data, status=status.HTTP_201_CREATED)

        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

# Return a book
class IsUserOnly(BasePermission):
    """
    Custom permission to only allow users with 'user' role to access the view.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'user'
        
class ReturnBookView(APIView):
    permission_classes = [IsUserOnly]  # Use the custom permission class

    def put(self, request):
        try:
            # Get the user's currently borrowed book
            borrowed_book = BorrowedBook.objects.get(user=request.user, actual_return_time__isnull=True)

            # Set the actual return time to now
            borrowed_book.actual_return_time = timezone.now()
            borrowed_book.save()

            # Increase the book quantity back
            borrowed_book.book.quantity += 1
            borrowed_book.book.save()

            return Response({'message': 'Book returned successfully'}, status=status.HTTP_200_OK)
        except BorrowedBook.DoesNotExist:
            return Response({'error': 'No borrowed book found'}, status=status.HTTP_404_NOT_FOUND)
