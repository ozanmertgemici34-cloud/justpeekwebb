"""
Backend API tests for JustPeek marketing website
Tests: Auth, Admin panel, Purchase requests
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://justpeek-test.preview.emergentagent.com').rstrip('/')

# Test credentials
ADMIN_EMAIL = "ozanmertgemici34@gmail.com"
ADMIN_PASSWORD = "ozan201223"

class TestHealthAndBasics:
    """Health check and basic endpoint tests"""
    
    def test_health_check(self):
        """Test health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✅ Health check passed")
    
    def test_api_root(self):
        """Test root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "JustPeek" in data.get("message", "")
        print("✅ API root endpoint passed")


class TestAuthentication:
    """Authentication flow tests"""
    
    def test_login_success(self):
        """Test login with admin credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        
        # Verify token is returned
        assert "access_token" in data, "No access_token in response"
        assert isinstance(data["access_token"], str)
        assert len(data["access_token"]) > 0
        
        # Verify user info
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "admin"
        print("✅ Login success - access_token returned")
        
        return data["access_token"]
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "invalid@email.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401, "Should return 401 for invalid credentials"
        print("✅ Invalid credentials returns 401")
    
    def test_get_me_endpoint(self):
        """Test /api/auth/me endpoint with valid token"""
        # First login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Get user info
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        print("✅ Get me endpoint passed")


class TestAdminPurchaseRequests:
    """Admin panel purchase requests tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Admin login failed")
        return response.json()["access_token"]
    
    def test_list_purchase_requests(self, admin_token):
        """Test listing purchase requests (admin only)"""
        response = requests.get(
            f"{BASE_URL}/api/admin/purchase-requests",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ List purchase requests passed - {len(data)} requests found")
    
    def test_create_and_delete_purchase_request(self, admin_token):
        """Test creating a purchase request then deleting it"""
        # First create a test purchase request
        unique_email = f"test_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "TestUser#1234",
                "product": "1 Aylık JustPeek",
                "message": "Test purchase request"
            }
        )
        assert create_response.status_code in [200, 201], f"Create failed: {create_response.text}"
        created_request = create_response.json()
        assert "id" in created_request
        request_id = created_request["id"]
        print(f"✅ Created purchase request with ID: {request_id}")
        
        # Now delete it
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert delete_response.status_code == 200, f"Delete failed: {delete_response.text}"
        data = delete_response.json()
        assert data.get("success") == True
        print("✅ Delete purchase request passed - no 404 error")
    
    def test_approve_purchase_request(self, admin_token):
        """Test approving a purchase request"""
        # Create a test request first
        unique_email = f"test_approve_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "TestApprove#1234",
                "product": "Haftalık JustPeek",
                "message": "Test approve"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Approve it
        approve_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=approved",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert approve_response.status_code == 200, f"Approve failed: {approve_response.text}"
        data = approve_response.json()
        assert data.get("success") == True
        print("✅ Approve purchase request passed")
        
        # Cleanup - delete the request
        requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
    
    def test_reject_purchase_request(self, admin_token):
        """Test rejecting a purchase request"""
        # Create a test request first
        unique_email = f"test_reject_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(
            f"{BASE_URL}/api/purchase-requests/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "email": unique_email,
                "discord_username": "TestReject#1234",
                "product": "2 Aylık JustPeek",
                "message": "Test reject"
            }
        )
        assert create_response.status_code in [200, 201]
        request_id = create_response.json()["id"]
        
        # Reject it
        reject_response = requests.put(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}/status?status=rejected",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert reject_response.status_code == 200, f"Reject failed: {reject_response.text}"
        data = reject_response.json()
        assert data.get("success") == True
        print("✅ Reject purchase request passed")
        
        # Cleanup - delete the request
        requests.delete(
            f"{BASE_URL}/api/admin/purchase-requests/{request_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )


class TestAdminStats:
    """Admin stats endpoint test"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Admin login failed")
        return response.json()["access_token"]
    
    def test_get_admin_stats(self, admin_token):
        """Test getting admin stats"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "active_users" in data
        assert "banned_users" in data
        assert "pending_purchase_requests" in data
        print(f"✅ Admin stats passed - Total users: {data['total_users']}")


class TestAdminUsers:
    """Admin user management tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Admin login failed")
        return response.json()["access_token"]
    
    def test_list_users(self, admin_token):
        """Test listing all users"""
        response = requests.get(
            f"{BASE_URL}/api/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0  # At least admin user should exist
        print(f"✅ List users passed - {len(data)} users found")


class TestEmailCapture:
    """Email capture endpoint tests"""
    
    def test_save_email(self):
        """Test saving an email for newsletter"""
        unique_email = f"newsletter_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/emails/", json={
            "email": unique_email
        })
        assert response.status_code in [200, 201]
        print("✅ Email capture passed")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
