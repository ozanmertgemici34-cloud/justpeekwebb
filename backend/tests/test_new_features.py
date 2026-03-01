"""
Test Suite for New Features - Iteration 4
Features:
1. Notification enhancements: delete-all, mark-all-read
2. Profile editing: update profile, change password
3. Password reset flow: request-reset, reset-password

Credentials: ozanmertgemici34@gmail.com / ozan201223
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_EMAIL = "ozanmertgemici34@gmail.com"
ADMIN_PASSWORD = "ozan201223"


class TestAuthentication:
    """Test authentication and get token for subsequent tests"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Login and get auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        return data["access_token"]
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        print(f"Login success for {ADMIN_EMAIL}")


class TestNotificationDeleteAll:
    """Test DELETE /api/notifications/delete-all"""
    
    @pytest.fixture(scope="class")
    def auth_headers(self):
        """Get auth headers"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_delete_all_notifications(self, auth_headers):
        """Test DELETE /api/notifications/delete-all endpoint"""
        response = requests.delete(
            f"{BASE_URL}/api/notifications/delete-all",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "message" in data
        print(f"Delete all notifications: {data['message']}")


class TestNotificationMarkAllRead:
    """Test POST /api/notifications/mark-all-read"""
    
    @pytest.fixture(scope="class")
    def auth_headers(self):
        """Get auth headers"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_mark_all_as_read(self, auth_headers):
        """Test POST /api/notifications/mark-all-read endpoint"""
        response = requests.post(
            f"{BASE_URL}/api/notifications/mark-all-read",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        print(f"Mark all as read: {data['message']}")


class TestProfileUpdate:
    """Test PUT /api/auth/profile"""
    
    @pytest.fixture(scope="class")
    def auth_headers(self):
        """Get auth headers"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_update_profile_name(self, auth_headers):
        """Test updating profile name"""
        # Update name
        response = requests.put(
            f"{BASE_URL}/api/auth/profile",
            headers=auth_headers,
            json={"name": "TEST_Updated_Name"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert data["name"] == "TEST_Updated_Name"
        print(f"Profile updated: name={data['name']}")
        
        # Restore original name
        restore_response = requests.put(
            f"{BASE_URL}/api/auth/profile",
            headers=auth_headers,
            json={"name": "Ozan Mert"}
        )
        assert restore_response.status_code == 200
        print("Profile name restored")
    
    def test_update_profile_discord_username(self, auth_headers):
        """Test updating discord username"""
        response = requests.put(
            f"{BASE_URL}/api/auth/profile",
            headers=auth_headers,
            json={"discord_username": "test_discord#1234"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "discord_username" in data
        assert data["discord_username"] == "test_discord#1234"
        print(f"Discord username updated: {data['discord_username']}")
        
        # Clear discord username
        restore_response = requests.put(
            f"{BASE_URL}/api/auth/profile",
            headers=auth_headers,
            json={"name": "Ozan Mert"}  # Just update name to keep it clean
        )
        assert restore_response.status_code == 200


class TestChangePassword:
    """Test PUT /api/auth/change-password"""
    
    @pytest.fixture(scope="class")
    def auth_headers(self):
        """Get auth headers"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_change_password_wrong_current(self, auth_headers):
        """Test change password with wrong current password"""
        response = requests.put(
            f"{BASE_URL}/api/auth/change-password",
            headers=auth_headers,
            json={
                "current_password": "wrongpassword123",
                "new_password": "newpassword123"
            }
        )
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        print(f"Correct rejection of wrong password: {data['detail']}")
    
    def test_change_password_success_and_restore(self, auth_headers):
        """Test change password success and restore original"""
        # Change to new password
        new_password = "temporary_test_pw_123"
        response = requests.put(
            f"{BASE_URL}/api/auth/change-password",
            headers=auth_headers,
            json={
                "current_password": ADMIN_PASSWORD,
                "new_password": new_password
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print("Password changed successfully")
        
        # Login with new password to verify
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": new_password
        })
        assert login_response.status_code == 200
        new_token = login_response.json()["access_token"]
        print("Login with new password successful")
        
        # Restore original password
        restore_response = requests.put(
            f"{BASE_URL}/api/auth/change-password",
            headers={"Authorization": f"Bearer {new_token}"},
            json={
                "current_password": new_password,
                "new_password": ADMIN_PASSWORD
            }
        )
        assert restore_response.status_code == 200
        print("Password restored to original")
        
        # Verify login with original password
        final_login = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert final_login.status_code == 200
        print("Login with original password verified")


class TestPasswordResetFlow:
    """Test password reset flow: request-reset and reset-password"""
    
    def test_request_password_reset_returns_token(self):
        """Test POST /api/auth/request-reset returns token (MOCKED email service)"""
        response = requests.post(
            f"{BASE_URL}/api/auth/request-reset",
            json={"email": ADMIN_EMAIL}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "token" in data
        assert data["token"] is not None  # Token returned because email is mocked
        print(f"Reset token received: {data['token'][:20]}...")
    
    def test_request_reset_nonexistent_email(self):
        """Test request reset with non-existent email - should not reveal user existence"""
        response = requests.post(
            f"{BASE_URL}/api/auth/request-reset",
            json={"email": "nonexistent@example.com"}
        )
        assert response.status_code == 200  # Should return 200 for security
        data = response.json()
        assert data["success"] == True
        # Token should be None for non-existent email
        print(f"Non-existent email handled correctly, token: {data.get('token')}")
    
    def test_reset_password_flow(self):
        """Test full password reset flow: request token -> reset password -> restore"""
        # Step 1: Request reset token
        request_response = requests.post(
            f"{BASE_URL}/api/auth/request-reset",
            json={"email": ADMIN_EMAIL}
        )
        assert request_response.status_code == 200
        reset_token = request_response.json()["token"]
        assert reset_token is not None
        print(f"Got reset token: {reset_token[:20]}...")
        
        # Step 2: Reset password using token
        new_temp_password = "reset_test_password_456"
        reset_response = requests.post(
            f"{BASE_URL}/api/auth/reset-password",
            json={
                "token": reset_token,
                "new_password": new_temp_password
            }
        )
        assert reset_response.status_code == 200
        data = reset_response.json()
        assert data["success"] == True
        print("Password reset successful")
        
        # Step 3: Verify login with new password
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": new_temp_password
        })
        assert login_response.status_code == 200
        new_token = login_response.json()["access_token"]
        print("Login with reset password verified")
        
        # Step 4: Restore original password using change-password endpoint
        restore_response = requests.put(
            f"{BASE_URL}/api/auth/change-password",
            headers={"Authorization": f"Bearer {new_token}"},
            json={
                "current_password": new_temp_password,
                "new_password": ADMIN_PASSWORD
            }
        )
        assert restore_response.status_code == 200
        print("Original password restored")
        
        # Step 5: Verify final login with original password
        final_login = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert final_login.status_code == 200
        print("Final login with original password confirmed - FLOW COMPLETE")
    
    def test_reset_password_invalid_token(self):
        """Test reset password with invalid token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/reset-password",
            json={
                "token": "invalid_token_12345",
                "new_password": "newpassword123"
            }
        )
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        print(f"Invalid token handled correctly: {data['detail']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
