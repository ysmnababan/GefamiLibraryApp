from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from .models import Book, BorrowedBook

class UserAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    list_display = ('email', 'username', 'role', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'role')
    ordering = ('email',)
    search_fields = ('email', 'username')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'first_name', 'last_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role', 'is_staff', 'is_active')}
        ),
    )
    # Specify which fields to use for creating a new user
    add_user = ('email', 'username', 'password1', 'password2', 'role')

# Register the new UserAdmin
admin.site.register(User, UserAdmin)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('name', 'author', 'quantity', 'publisher')
    search_fields = ('name', 'author')

@admin.register(BorrowedBook)
class BorrowedBookAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'borrowed_time', 'return_time', 'actual_return_time')
    search_fields = ('user__email', 'book__name')