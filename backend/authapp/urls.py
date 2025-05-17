from django.urls import path
from .views import register, login, me, upgrade_to_pro

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('me/', me, name='me'),
    path('upgrade-to-pro/', upgrade_to_pro, name='upgrade_to_pro'),
]
